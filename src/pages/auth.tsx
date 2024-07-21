import { signIn, ClientSafeProvider } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface AuthProps {
  providers: Record<string, ClientSafeProvider> | null;
}

const Auth = ({ providers }: AuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignUp) {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const result = await signIn("credentials", {
          email,
          password,
          callbackUrl: "/dashboard",
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        const data = await res.json();
        setError(data.error || "Failed to sign up");
      }
    } else {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        setError(
          res.error === "CredentialsSignin"
            ? "Incorrect email or password"
            : res.error
        );
      } else {
        window.location.href = "/dashboard";
      }
    }
  };

  if (!providers) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Alert severity="error" sx={{ mt: 8 }}>
          No authentication providers found. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={6} sx={{ p: 2, mt: 8, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }}
                >
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ width: "100%", my: 2 }}>or</Divider>
          {Object.values(providers).map(
            (provider) =>
              provider.name !== "Credentials" && (
                <Button
                  key={provider.name}
                  onClick={() =>
                    signIn(provider.id, { callbackUrl: "/dashboard" })
                  }
                  fullWidth
                  variant="outlined"
                  sx={{
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "40px",
                    border: "1px solid #747775",
                    borderRadius: "4px",
                    textTransform: "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "12px",
                      }}
                    >
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        style={{
                          display: "block",
                          height: "20px",
                          width: "20px",
                        }}
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        ></path>
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        ></path>
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        ></path>
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        ></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "500",
                        fontFamily: "'Roboto', arial, sans-serif",
                      }}
                    >
                      {isSignUp
                        ? `Sign up with ${provider.name}`
                        : `Sign in with ${provider.name}`}
                    </Typography>
                  </Box>
                </Button>
              )
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const baseUrl =
    process.env.NEXTAUTH_URL || "https://availability-schedule.vercel.app";

  try {
    const res = await fetch(`${baseUrl}/api/auth/providers`);
    const providers = await res.json();

    return {
      props: { providers },
    };
  } catch (error) {
    console.error("Error fetching providers in getServerSideProps:", error);
    return {
      props: { providers: null },
    };
  }
};

export default Auth;
