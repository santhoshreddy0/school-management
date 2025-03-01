/**
 * @swagger
 * /api/school/createSchool:
 *   post:
 *     summary: Create a new school
 *     description: Registers a new school with the provided name and description.
 *     operationId: createSchool
 *     tags:
 *       - School
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
 *               desc:
 *                 type: string
 *             required:
 *               - name
 *               - desc
 *     responses:
 *       '200':
 *         description: Successful school creation
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
 *                     school:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *                         id:
 *                           type: string
 *                         active:
 *                           type: boolean
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: ""
 *       '422':
 *         description: Validation or school-related errors (e.g., school already exists, invalid data)
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
 *                     - label: "name"
 *                       path: "name"
 *                       message: "School name is required"
 *                       log: "_required"
 *                       errors: []
 *                 message:
 *                   type: string
 *                   example: "School already exists"
 *       '401':
 *         description: Unauthorized (missing or invalid authentication token)
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
 *       '429':
 *         description: Too Many Requests (rate limiting)
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
 *                   example: "Too many requests, please try again later."
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
 * /api/school/updateSchool:
 *   put:
 *     summary: Update an existing school
 *     description: Updates the name, description, or active status of an existing school. Requires an authentication token in the header.
 *     operationId: updateSchool
 *     tags:
 *       - School
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
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Successful school update
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
 *                     school:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *                         id:
 *                           type: string
 *                         active:
 *                           type: boolean
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
 *                   example: "School does not exist"
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
 *       '429':
 *         description: Too Many Requests (rate limiting)
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
 *                   example: "Too many requests, please try again later."
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
 * /api/school/addAdmin:
 *   post:
 *     summary: Add an admin to a school
 *     description: Adds an admin to a specified school. Requires an authentication token in the header.
 *     operationId: addAdmin
 *     tags:
 *       - School
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
 *               schoolId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - schoolId
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Successful admin addition
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
 *                     admin:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         school:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: ""
 *       '422':
 *         description: Validation or admin-related errors (e.g., existing user, invalid data)
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
 *       '401':
 *         description: Unauthorized (missing or invalid authentication token)
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
 *       '429':
 *         description: Too Many Requests (rate limiting)
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
 *                   example: "Too many requests, please try again later."
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
 * /api/school/getSchools:
 *   get:
 *     summary: Get all schools
 *     description: Fetches a paginated list of all schools. Requires an authentication token in the header.
 *     operationId: getSchools
 *     tags:
 *       - School
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           description: The authentication token required for the operation.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           description: The page number to retrieve. Defaults to 1.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 2
 *           description: The number of records to retrieve per page. Defaults to 2.
 *     responses:
 *       '200':
 *         description: Successful response with schools data
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
 *                     schools:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           active:
 *                             type: boolean
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     page:
 *                       type: integer
 *                       example: 1
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: ""
 *       '401':
 *         description: Unauthorized (missing or invalid authentication token)
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
 *       '429':
 *         description: Too Many Requests (rate limiting)
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
 *                   example: "Too many requests, please try again later."
 *                 message:
 *                   type: string
 *                   example: ""
 *       '500':
 *         description: Internal server error
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
