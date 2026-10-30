import DataTable from '../../../../../../../../resources/js/components/datatable/table';
import { Props, columns } from './types';

export default function Index({ floor }: Props) {
    const data = floor.data;

    return (
        <DataTable
            heading={{ head: 'Lantai' }}
            data={data}
            columns={columns}
            link={{ add: 'hotel.floor.create' }}
        />
    );
}
