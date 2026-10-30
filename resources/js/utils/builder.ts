import type { BuilderFormData } from '../components/builder/BuilderProperties';
import type { BuilderMenuItem } from '../types/builder';

export function flattenMenuItems(items: BuilderMenuItem[]): BuilderMenuItem[] {
    const result: BuilderMenuItem[] = [];

    for (const item of items) {
        result.push(item);

        if (item.children_recursive?.length) {
            result.push(...flattenMenuItems(item.children_recursive));
        }
    }

    return result;
}

export function sameData(
    first: BuilderFormData,
    second: BuilderFormData,
): boolean {
    try {
        return JSON.stringify(first) === JSON.stringify(second);
    } catch {
        return false;
    }
}
