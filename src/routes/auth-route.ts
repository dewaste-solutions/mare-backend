import express from "express";
import { createInvitationToken } from "../controller/auth/create-invitation-token";
import { createUser } from "../controller/auth/create-user";
import { getAccessToken } from "../controller/auth/get-access-token";
import { getAllRoles } from "../controller/auth/get-all-roles";
import { getProfile } from "../controller/auth/get-profile";
import { signInUser } from "../controller/auth/signin-user";
import { signoutUser } from "../controller/auth/signout-user";
import { verifyInvitationToken } from "../controller/auth/verify-invitation-token";
import {
	validateAuthInvitation,
	validateAuthSignIn,
	validateAuthSignup,
} from "../middleware/auth/validate-body";
import { checkPermissions } from "../middleware/rabc";

export const authRoutes = express.Router();

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user account
 *     description: |
 *       Creates a new user account with the provided information. By default, assigns the "guest" role.
 *
 *       Required Permission:
 *       - none
 *
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Must contain at least 3 of - lowercase, uppercase, number, special char (!@#$%^&*)
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *           example:
 *             email: "john.doe@example.com"
 *             password: "Pass123!@#"
 *             firstName: "John"
 *             lastName: "Doe"
 *     responses:
 *       201:
 *         description: User successfully created
 *       404:
 *         description: Role not found
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
authRoutes.post("/signup", validateAuthSignup, createUser);

/**
 * @openapi
 * /api/auth/signin:
 *   post:
 *     summary: Authenticate user and get tokens
 *     description: |
 *       Authenticates user credentials and returns an access token.
 *       Sets a HTTP-only cookie with refresh token.
 *       Access token expires in 1 day, refresh token in 7 days.
 *
 *       Required Permission:
 *       - none
 *
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *           example:
 *             email: "john.doe@example.com"
 *             password: "Pass123!@#"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *                   description: JWT access token
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
authRoutes.post("/signin", validateAuthSignIn, signInUser);

/**
 * @openapi
 * /api/auth/signout:
 *   post:
 *     summary: Sign out user
 *     description: |
 *       Revokes the refresh token and clears the cookie.
 *       Frontend should also clear any stored access tokens.
 *
 *       Required Permission:
 *       - none
 *
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully signed out
 */
authRoutes.post("/signout", signoutUser);

/**
 * @openapi
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: |
 *       Returns the profile information for the authenticated user
 *
 *       Required Permission:
 *       - read:profile
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     roleId:
 *                       type: string
 *                     roleName:
 *                       type: string
 *                     image:
 *                       type: string
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: User profile not found
 */
authRoutes.get("/profile", checkPermissions(["read:profile"]), getProfile);

// getAccessToken also have checkPermissions generate:access-token
/**
 * @openapi
 * /api/auth/renew-access-token:
 *   post:
 *     summary: Get new access token
 *     description: |
 *       Uses the refresh token (from cookie) to generate a new access token.
 *       Call this when access token expires.
 *
 *       Required Permission:
 *       - create:application-question
 *
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *                   description: New JWT access token
 *       401:
 *         description: Invalid or expired refresh token
 *       403:
 *         description: Insufficient permissions
 */
authRoutes.post("/renew-access-token", getAccessToken);

/**
 * @openapi
 * /api/auth/generate-invitation:
 *   post:
 *     summary: Generate invitation token
 *     description: |
 *       Creates an invitation token and sends email to invited user
 *
 *       Required Permission:
 *       - create:invitation
 *
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *               - emailTo
 *             properties:
 *               roleId:
 *                 type: string
 *                 format: uuid
 *               emailTo:
 *                 type: string
 *                 format: email
 *           example:
 *             roleId: "123e4567-e89b-12d3-a456-426614174000"
 *             emailTo: "invite@example.com"
 *     responses:
 *       201:
 *         description: Invitation created and email sent
 *       401:
 *         description: Unauthorized, missing or invalid access token
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Server error
 */
authRoutes.post(
	"/generate-invitation",
	checkPermissions(["create:invitation"]),
	validateAuthInvitation,
	createInvitationToken,
);

/**
 * @openapi
 * /api/auth/verify-invitation:
 *   post:
 *     summary: Verify invitation token
 *     description: |
 *       Validates an invitation token and returns invited user ID
 *
 *       Required Permission:
 *       - none
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: invitationToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The invitation token received via email
 *     responses:
 *       200:
 *         description: Token verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     invitedUsersId:
 *                       type: string
 *                       format: uuid
 *       401:
 *         description: Invalid or expired token
 */
authRoutes.post("/verify-invitation", verifyInvitationToken);

/**
 * @openapi
 * /api/auth/get-all-roles:
 *   get:
 *     summary: Get all available roles
 *     description: |
 *       Returns a list of all roles in the system
 *
 *       Required Permission:
 *       - read:roles
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *       401:
 *         description: Unauthorized, missing or invalid access token
 *       403:
 *         description: Insufficient permissions
 */
authRoutes.get("/get-all-roles", checkPermissions(["read:roles"]), getAllRoles);
