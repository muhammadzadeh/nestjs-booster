/* eslint-disable @typescript-eslint/no-empty-function */
import { INestApplication, Type } from '@nestjs/common';
import * as constants from '@nestjs/common/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as apiExcludeControllerExplorer from '@nestjs/swagger/dist/explorers/api-exclude-controller.explorer';
import * as swaggerExplorer from '@nestjs/swagger/dist/swagger-explorer';
import { Configuration } from '@repo/config';
import { ControllerType, MetaKey } from '@repo/types/common.enums';
import { TENANT_CONFIG } from '@repo/types/constants';

// This type is used to mark the module as mutable
type Mutable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Overrides swagger explorer behavior
 *
 * Since we want to exclude routes based on their `ControllerType`, we have to override the default method
 *
 * With current implementation, we are ignoring controllers which their type doesn't match configured type
 */
function configureExcludedControllers(): (type: ControllerType) => void {
  // Configured type to check controller type
  let currentType: ControllerType | undefined = undefined;

  // override default implementation
  (apiExcludeControllerExplorer as Mutable<typeof apiExcludeControllerExplorer>).exploreApiExcludeControllerMetadata = (
    method: Type<unknown>,
  ): boolean => {
    // Throw exception if we forgot to call configure
    if (currentType == undefined) throw new Error(`no type is selected`);

    // By returning `true` we are indicating to the swagger explorer to ignore the controller
    //  hence, we check if current controller type is not same as the configured
    return Reflect.getMetadata(MetaKey.CONTROLLER_TYPE, method) != currentType;
  };

  // Expose a function to configure `currentType`
  return (type: ControllerType): void => {
    currentType = type;
  };
}

/**
 * Overrides swagger explorer behavior
 *
 * Since we want to change global prefix based on `ControllerType`, we have to override the default method
 *
 * With current implementation, we simply trim the route prefix
 */
function configureGlobalPrefix(): (type: string) => void {
  // Configured route for prefix manipulation
  let currentRoute: { route: string; length: number } | undefined = undefined;

  // override default implementation
  swaggerExplorer.SwaggerExplorer.prototype['reflectControllerPath'] = (metaType: object): string => {
    // Throw exception if we forgot to call configure
    if (currentRoute == undefined) throw new Error(`no type is selected`);

    // Retrieve current route
    const currentPath: string = Reflect.getMetadata(constants.PATH_METADATA, metaType);

    // If current route doesn't have selected prefix, there is an issue with route path and type
    if (!currentPath.startsWith(currentRoute.route)) {
      throw new Error(
        `failed to change route for swagger on ${currentPath}. expected to start with "${currentRoute.route}"`,
      );
    }

    // trim route
    return currentPath.slice(currentRoute.length);
  };

  // Expose a function to configure `currentRoute`
  return (type: string): void => {
    currentRoute = { route: type, length: type.length };
  };
}

export function configureSwagger(app: INestApplication): void {
  const cfg = app.get(Configuration).swagger;
  const appConfig = app.get(Configuration).app;
  if (cfg == undefined || !cfg.enabled) return;

  const path = '/docs';
  const excludeConfigure = configureExcludedControllers();
  const prefixConfigure = cfg.handleGlobalPrefix ? configureGlobalPrefix() : (): void => {};

  for (const { type, name, route } of Object.values(TENANT_CONFIG)) {
    excludeConfigure(type);
    prefixConfigure(route);
    const config = new DocumentBuilder()
      .setTitle(`${name}`)
      .addBearerAuth()
      .addServer(appConfig.url ?? '')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(route + path, app, document);
  }
}
