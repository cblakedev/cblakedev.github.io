import * as React from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { DataObject } from './Home';

interface DataProps{
  rows: DataObject[];
  fetchData: () => void;
  searchIdValue: string;
  selectedRows: string[]
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>
}

const columns: GridColDef[] = [
  { field: 'orderId', headerName: 'Order Id', disableColumnMenu: true, width: 300 },
  { field: 'createdDate', headerName: 'Creation Date', disableColumnMenu: true, width: 200},
  { field: 'createdByUserName', headerName: 'Created By', disableColumnMenu: true, width: 150 },
  { field: 'orderType', headerName: 'Order Type', disableColumnMenu: true, width: 150},
  { field: 'customerName', headerName: 'Customer Name', sortable: false, disableColumnMenu: true, width: 150},
];

export default function DataTable(props: DataProps) {

  const handleRowSelection = (selection: GridRowId[]): void => {
		props.setSelectedRows(selection.map((id) => String(id)))
	}

  React.useEffect(() => {
    props.fetchData()
  }, [props.searchIdValue]);

  return (
    <Box sx={{ height: '100vh', width: '100%', paddingTop: 3 }}>
      <DataGrid
        rows={props.rows}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelection}
        rowSelectionModel={props.selectedRows}
      />
    </Box>
  );
}