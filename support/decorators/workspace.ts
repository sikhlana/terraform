export function Workspace(workspace: string, project?: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata('tfe:workspace', target, [workspace, project]);
  };
}
