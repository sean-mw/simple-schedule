import { signOut } from "next-auth/react";
import { AppBar, Toolbar, Button, Stack, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type NavbarProps = {
  onAddEmployee: () => void;
  onRequestAvailability: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  onAddEmployee,
  onRequestAvailability,
}) => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: theme.palette.background.default }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary" onClick={onAddEmployee}>
              Add Employee
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onRequestAvailability}
            >
              Request Availability
            </Button>
          </Stack>
        </Box>
        <Button variant="contained" color="error" onClick={() => signOut()}>
          Sign out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
