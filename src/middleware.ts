import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { auth } from "@/auth"

export const publicRoutes = [
  "/",
  
];

// Routes that require authentication
export const authRoutes = [
  "/",

];

// Restricted routes for logged-in users
const restrictedRoutes = [
  "/home",

];


// API routes that require authentication
export const apiAuthPrefix = "/api/auth";

// Default login redirect path
export const DEFAULT_LOGIN_REDIRECT_PATH = "/home";

// const { auth } = NextAuth(authConfig);
// this was caussing the issue  ⨯ Error [ReferenceError]: Cannot access '__WEBPACK_DEFAULT_EXPORT__' before initialization since it couldn't get the data from the auth.config.ts file before initializing the auth function hence used auth instead in this 

export default auth((req) => {
  const { nextUrl } = req;

  try {

    const userLoggedIn = req.auth ? true : false;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.some(route => nextUrl.pathname === route || nextUrl.pathname.startsWith(route));
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isRestrictedRoute = restrictedRoutes.some(route => nextUrl.pathname === route || nextUrl.pathname.startsWith(route));

   

    if (isApiAuthRoute) {
      // console.log("API auth route, proceeding without checks.");
      return null;
    }

    if (isAuthRoute) {
      if (userLoggedIn) {
        // console.log("User logged in, redirecting to default path.");
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT_PATH, nextUrl));
      }
      // console.log("Auth route, but user not logged in.");
      return null;
    }

    if (isRestrictedRoute) {
      if (!userLoggedIn) {
        // console.log("Restricted route and user not logged in, redirecting to home.");
        return Response.redirect(new URL("/", nextUrl));
      }
    }



    // console.log("Route allowed, proceeding.");
    return null;
  } catch (error) {
    // console.error(`Error handling request for ${nextUrl.pathname}:`, error);
    throw error;
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.ico$|.*\\.png$).*)", // Exclude certain paths
  ],
};
