import DataTable from '../../../../../../../../resources/js/components/datatable/table';
import { Props, columns } from './types';

export default function index({ staff }: Props) {
    const data = staff.data;

    return (
        <>
            <DataTable
                heading={{ head: 'Staff' }}
                data={data}
                columns={columns}
                link={{ add: 'company.staff.create' }}
            />
        </>
    );
}
