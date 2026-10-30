import DataTable from '../../../../../../../../resources/js/components/datatable/table';
import { Props, columns } from './types';

export default function index({ hotel }: Props) {
    const data = hotel.data;

    return (
        <>
            <DataTable
                heading={{ head: 'Base Hotel' }}
                data={data}
                columns={columns}
                link={{ add: 'hotel.base-hotel.create' }}
            />
        </>
    );
}
