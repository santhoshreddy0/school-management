/**
 * @swagger
 * /api/user/createUser:
 *   post:
 *     summary: Create a new user
 *     description: Registers a new user with the provided name, email, and password.
 *     operationId: createUser
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Successful user creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     longToken:
 *                       type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: ""
 *       '422':
 *         description: Validation or user-related errors (e.g., existing user, invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                       path:
 *                         type: string
 *                       message:
 *                         type: string
 *                       log:
 *                         type: string
 *                       errors:
 *                         type: array
 *                         items:
 *                           type: string
 *                   example:
 *                     - label: "email"
 *                       path: "email"
 *                       message: "email is required"
 *                       log: "_required"
 *                       errors: []
 *                 message:
 *                   type: string
 *                   example: "User already exists"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Something went wrong!"
 *
 * /api/user/updateProfile:
 *   put:
 *     summary: Update user profile
 *     description: Update the name and/or password of an existing user. Requires an authentication token in the header.
 *     operationId: updateProfile
 *     tags:
 *       - User
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           description: The authentication token required for the operation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful profile update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: ""
 *       '422':
 *         description: Validation errors (e.g., invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                       path:
 *                         type: string
 *                       message:
 *                         type: string
 *                       log:
 *                         type: string
 *                       errors:
 *                         type: array
 *                         items:
 *                           type: string
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "User does not exist"
 *       '401':
 *         description: Unauthorized (missing or invalid authentication)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                 errors:
 *                   type: string
 *                   example: "unauthorized"
 *                 message:
 *                   type: string
 *                   example: ""
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Something went wrong!"
 *
 * /api/user/loginUser:
 *   post:
 *     summary: Login a user
 *     description: Logs in a user with the provided email and password.
 *     operationId: loginUser
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     longToken:
 *                       type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: ""
 *       '422':
 *         description: Validation or user-related errors (e.g., invalid email/password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                       path:
 *                         type: string
 *                       message:
 *                         type: string
 *                       log:
 *                         type: string
 *                       errors:
 *                         type: array
 *                         items:
 *                           type: string
 *                   example:
 *                     - label: "email"
 *                       path: "email"
 *                       message: "email is required"
 *                       log: "_required"
 *                       errors: []
 *                 message:
 *                   type: string
 *                   example: "User does not exist"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Something went wrong!"
 */
