import React, { ReactNode } from 'react';

export interface Column<Type> {
    key: keyof Type;
    label: string;
    render?: (row: Type) => ReactNode;
}

export interface Heading {
    head: string;
}

export interface LinkAdd {
    add: string;
}

export interface DataTableProps<Type> {
    data: Type[];
    heading: Heading;
    link: LinkAdd;
    columns: Column<Type>[];
}
