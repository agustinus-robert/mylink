import DataTable from '../../../../../../../../resources/js/components/datatable/table';
import { Props, columns } from './types';

export default function index({ building }: Props) {
    const data = building.data;

    return (
        <DataTable
            heading={{ head: 'Bangunan' }}
            data={data}
            columns={columns}
            link={{ add: 'hotel.building.create' }}
        />
    );
}
