import { TerraformStack } from 'cdktf';
import { Construct } from 'constructs';
import { Data, TemplateFunction, compile } from 'ejs';
import { existsSync, readFileSync } from 'fs';
import * as getCallerFile from 'get-caller-file';
import { globSync } from 'glob';
import { snakeCase } from 'lodash';
import { orderBy } from 'natural-orderby';
import { extname, join, resolve } from 'node:path';
import { Class } from 'type-fest';

export function appendRuntimeExtension(name: string): string {
  return `${name}${extname(__filename)}`;
}

export function find(pattern: string): string[] {
  return orderBy(
    globSync(pattern, {
      cwd: resolve(__dirname, '..'),
      dot: false,
      follow: false,
      absolute: true,
    }),
  );
}

export function isClass<TClass>(obj: any): obj is Class<TClass> {
  if (typeof obj !== 'function') {
    return false;
  }

  const descriptor = Object.getOwnPropertyDescriptor(obj, 'prototype');
  if (!descriptor) {
    return false;
  }

  return !descriptor.writable;
}

export function isConstructClass(
  obj: any,
): obj is Class<Construct> & { id: string } {
  return typeof obj.id !== 'undefined' && isClass(obj);
}

export function load(file: string) {
  return require(file);
}

export function* functions<TFunction extends Function>(
  file: string,
): IterableIterator<TFunction> {
  for (const fn of Object.values<TFunction>(load(file))) {
    if (typeof fn === 'function') {
      yield fn;
    }
  }
}

export function* classes<TClass extends object>(
  file: string,
): IterableIterator<Class<TClass>> {
  for (const cls of functions<Class<TClass>>(file)) {
    if (isClass(cls)) {
      yield cls;
    }
  }
}

export function stackId(cls: Class<TerraformStack>): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (cls.id) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return cls.id;
  }

  let name = cls.name;
  name = snakeCase(name);
  name = name.replace(/_stack$/, '');

  return name;
}

const compiledTemplates = new Map<string, TemplateFunction>();

export function loadScript<TData extends Data>(
  name: string,
  data?: TData,
): string | '' {
  const directory = String(getCallerFile()).split('/resources')[0];

  let file = join(directory, 'scripts', `${name}.ejs`);
  if (existsSync(file)) {
    if (!compiledTemplates.has(file)) {
      compiledTemplates.set(
        file,
        compile(readFileSync(file, { encoding: 'utf-8' }), {
          async: false,
          client: false,
        }),
      );
    }

    return (compiledTemplates.get(file) as TemplateFunction)(data);
  }

  file = join(directory, 'scripts', name);
  if (existsSync(file)) {
    return readFileSync(file, { encoding: 'utf-8' });
  }

  return '';
}
