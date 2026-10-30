import DataTable from '../../../../../../../../resources/js/components/datatable/table';
import { Props, columns } from './types';

export default function index({ department }: Props) {
    const data = department.data;

    return (
        <>
            <DataTable
                heading={{ head: 'Department' }}
                data={data}
                columns={columns}
                link={{ add: 'company.department.create' }}
            />
        </>
    );
}
