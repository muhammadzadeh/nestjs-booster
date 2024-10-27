import { useContainer } from 'class-validator';

export function configureGlobalTransformers(iocContainer: { get(someClass: unknown): unknown }): void {
  useContainer(iocContainer, { fallbackOnErrors: true });
}
