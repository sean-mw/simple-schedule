import { signOut } from "next-auth/react";
import { AppBar, Toolbar, Button, Stack, Box } from "@mui/material";
import Logo from "./Logo";

type NavbarProps = {
  onAddEmployee?: () => void;
  onRequestAvailability?: () => void;
  hideButtons?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({
  onAddEmployee,
  onRequestAvailability,
  hideButtons,
}) => {
  return (
    <AppBar position="static" sx={{ bgcolor: "white" }}>
      <Toolbar>
        <Logo style={{ marginRight: 16 }} />
        {!hideButtons && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onAddEmployee}
                >
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
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
