import React from "react";
import { Box, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Toolbar, Modal, Typography, Autocomplete } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "./OrderTable";
import { v4 as uuidv4 } from "uuid";
import { DataObject } from "@mui/icons-material";

const modalStyle = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	minWidth: 300,
	maxWidth: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 2,
};

const orderTypeOptions = [
	{ label: "Standard" },
	{ label: "ReturnOrder" },
	{ label: "TransferOrder" },
	{ label: "SaleOrder" },
	{ label: "PurchaseOrder" },
];

export interface DataObject {
	orderId: string;
	orderType: string;
	customerName: string;
	createdDate: string;
	createdByUserName: string;
}

export default function OrderHome() {
	const [rows, setRows] = React.useState<DataObject[]>([]);
	const [searchIdValue, setSearchIdValue] = React.useState<string>("");
	const [orderTypeValue, setOrderTypeValue] = React.useState<string | null>(null);
	const [open, setOpen] = React.useState<boolean>(false);
	const [orderId, setOrderId] = React.useState<string>("");
	const [creationOrderType, setCreationOrderType] = React.useState<string>("");
	const [customerName, setCustomerName] = React.useState<string>("");
	const [creatorName, setCreatorName] = React.useState<string>("");
	const [orderCreationDate, setOrderCreationDate] = React.useState<string>("");
	const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
	const [counter, setCounter] = React.useState<number>(0);

	const openCreateOrderModal = (): void => {
		setOrderId(uuidv4());
		setOpen(true);
	};

	const handleOrderClose = (): void => {
		setOrderId("");
		setCreationOrderType("");
		setCustomerName("");
		setCreatorName("");
		setOrderCreationDate("");
		setOpen(false);
	};

	const fetchData = async (): Promise<void> => {
		const response = await fetch("https://red-candidate-web.azurewebsites.net/api/Orders", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				ApiKey: "b7b77702-b4ec-4960-b3f7-7d40e44cf5f4",
			},
		});

		const data = await response.json();
		const rowsWithId = data.map((row: DataObject, index: number) => ({ ...row, id: index + 1 }));

		setRows(rowsWithId);
	};

	const handleIdSearch = (): void => {
		if (searchIdValue !== "") {
			const filtered = rows.filter((row) => row.orderId.includes(searchIdValue));
			
			if (filtered.length >= 1) {
				setRows(filtered);
			} else {
				setRows([]);
			}
		}
	};

	const handleKeyPress = (event: React.KeyboardEvent): void => {
		if (event.key === "Enter") {
			handleIdSearch();
		}
	};

	const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		const response = await fetch("https://red-candidate-web.azurewebsites.net/api/Orders", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				ApiKey: "b7b77702-b4ec-4960-b3f7-7d40e44cf5f4",
			},
			body: JSON.stringify({
				orderId: orderId,
				orderType: creationOrderType,
				customerName: customerName,
				createdDate: orderCreationDate,
				createdByUserName: creatorName,
			}),
		});

		const data = await response.json();
		handleOrderClose();
		fetchData();
	};

	const handleRowDeletion = (): void => {
		const orderIdList = selectedRows.map((rowIndex: number) => rows[rowIndex - 1].orderId);

		if (orderIdList.length >= 1) {
			const fetchOrderDelete = async () => {
				const response = await fetch("https://red-candidate-web.azurewebsites.net/api/Orders/Delete", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						ApiKey: "b7b77702-b4ec-4960-b3f7-7d40e44cf5f4",
					},
					body: JSON.stringify(orderIdList),
				});
			};

			fetchOrderDelete();
			setCounter(counter + 1);
		}
	};

	const handleOrderTypeChange = (e: React.ChangeEvent<{}>, orderType: string | null): void => {
		setOrderTypeValue(orderType);

		if (orderType) {
			const fetchOrderTypeData = async () => {
				const response = await fetch(`https://red-candidate-web.azurewebsites.net/api/Orders/ByType?orderType=${orderType}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						ApiKey: "b7b77702-b4ec-4960-b3f7-7d40e44cf5f4",
					},
				});

				const data = await response.json();
				const rowsWithId = data.map((row: DataObject, index: number) => ({ ...row, id: index + 1 }));

				setRows(rowsWithId);
			};

			fetchOrderTypeData();
		} else {
			fetchData();
		}
	};

	return (
		<>
			<Box>
				<Toolbar>
					<Grid container sx={{ marginTop: "20px" }}>
						<Grid className="customerSearchWrapper" sx={{ marginRight: 4, display:{xs: "none", sm:"block"} }}>
							<TextField
								className="customerSearch"
								label="Customer Search"
								size="small"
								variant="outlined"
								value={searchIdValue}
								onKeyPress={handleKeyPress}
								onChange={(e) => setSearchIdValue(e.target.value)}
							/>
							<Button variant="contained" sx={{ minWidth: "45px", padding: 0, boxShadow: 0 }} onClick={handleIdSearch}>
								<SearchIcon />
							</Button>
						</Grid>
						<Grid>
							<Button variant="contained" sx={{ marginRight: 4, height: "100%", boxShadow: 0 }} onClick={openCreateOrderModal}>
								<AddIcon /> <Box sx={{display:{xs: "none", lg:"block"}}}>Create Order</Box>
							</Button>
						</Grid>
						<Grid>
							<Button variant="contained" sx={{ marginRight: 4, height: "100%", boxShadow: 0 }} onClick={handleRowDeletion}>
								<DeleteIcon /> <Box sx={{display:{xs: "none", lg:"block"}}}>Delete Selected</Box>
							</Button>
						</Grid>
						<Grid>
							<Autocomplete
								id="orderTypeFilter"
								options={orderTypeOptions.map((option) => option.label)}
								value={orderTypeValue}
								onChange={(e, value) => handleOrderTypeChange(e, value)}
								sx={{ width: 200, display:{xs: "none", md:"block"} }}
								renderInput={(params) => <TextField {...params} label="Order Type" />}
								size="small"
							/>
						</Grid>
					</Grid>
				</Toolbar>
			</Box>

			<DataTable
				rows={rows}
				fetchData={fetchData}
				searchIdValue={searchIdValue}
				setSelectedRows={setSelectedRows}
				selectedRows={selectedRows}
				counter={counter}
			/>

			<Modal open={open} onClose={handleOrderClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<Box sx={modalStyle}>
					<Typography id="modal-modal-title" variant="h6" component="h2" sx={{marginBottom: 1}}>
						Create Order
					</Typography>
					<form onSubmit={handleOrderSubmit}>
						<Grid container>
							<Grid item={true} xs={6} sx={{ paddingRight: 1 }}>
								<TextField label="Customer Name" variant="outlined" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
							</Grid>
							<Grid item={true} xs={6} sx={{ paddingLeft: 1 }}>
								<FormControl sx={{ width: "100%" }}>
									<InputLabel id="orderCreationOrderType">Order Type</InputLabel>
									<Select
										labelId="orderCreationOrderType"
										id="orderCreationOrderTypeSelection"
										value={creationOrderType}
										label="Order Type"
										onChange={(e) => setCreationOrderType(e.target.value)}
										required
									>
										<MenuItem value={"Standard"}>Standard</MenuItem>
										<MenuItem value={"ReturnOrder"}>ReturnOrder</MenuItem>
										<MenuItem value={"TransferOrder"}>TransferOrder</MenuItem>
										<MenuItem value={"SaleOrder"}>SaleOrder</MenuItem>
										<MenuItem value={"PurchaseOrder"}>PurchaseOrder</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item={true} xs={12} sx={{ marginTop: 2 }}>
								<TextField label="Order Id" variant="outlined" value={orderId} disabled sx={{ width: "100%" }} required />
							</Grid>
							<Grid item={true} xs={6} sx={{ marginTop: 2, paddingRight: 1 }}>
								<TextField label="Created By" variant="outlined" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} required />
							</Grid>
							<Grid item={true} xs={6} sx={{ marginTop: 2, paddingLeft: 1 }}>
								<TextField
									type="date"
									sx={{ width: "100%" }}
									value={orderCreationDate}
									onChange={(e) => setOrderCreationDate(e.target.value)}
									required
								></TextField>
							</Grid>
							<Grid item={true} xs={12} sx={{ paddingTop: 2 }}>
								<Button type="submit" variant="contained" sx={{ width: "100%" }}>
									Submit Order
								</Button>
							</Grid>
						</Grid>
					</form>
				</Box>
			</Modal>
		</>
	);
}
