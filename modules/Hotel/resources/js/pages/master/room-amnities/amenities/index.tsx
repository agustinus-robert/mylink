import DataTable from '../../../../../../../../resources/js/components/datatable/table';
import { Props, columns } from './types';

export default function Index({ amenities }: Props) {
    const data = amenities.data;

    return (
        <DataTable
            heading={{ head: 'Amenities' }}
            data={data}
            columns={columns}
            link={{ add: 'amenities-room.amenities.create' }}
        />
    );
}
