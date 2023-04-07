import { Link, Toolbar, Box, AppBar  } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function ButtonAppBar() {
	return (
		<Box>
			<AppBar position="static" sx={{backgroundColor:"white", boxShadow: 0, borderBottom: 2, borderBottomColor:"#dbdbdb"}}>
				<Toolbar>
					<Box sx={{flexGrow: 1}}>
						<Link className="homeLink" href="#" sx={{color: "grey", border: "none", textDecoration: "none"}}>
							<img className="redLogo" src={'/assets/red_logo.png'} alt="Red Technologies Logo"/>
							<span> Home </span>
						</Link>
					</Box>		
					<Box>
						<SettingsIcon sx={{color: "#555", paddingRight: 1, fontSize: "1.8rem"}}/>
						<AccountCircleIcon sx={{color: "#555", fontSize: "1.8rem"}}/>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
