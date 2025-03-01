/**
 * @swagger
 * /api/classroom/createClassroom:
 *   post:
 *     summary: Create a new classroom
 *     description: Creates a new classroom with the provided details (name, description, capacity) for a specific school.
 *     operationId: createClassroom
 *     tags:
 *       - Classroom
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
 *               desc:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Classroom successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 class:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     capacity:
 *                       type: integer
 *                     schoolId:
 *                       type: string
 *                     active:
 *                       type: boolean
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
 *                   example:
 *                     - label: "name"
 *                       path: "name"
 *                       message: "name is required"
 *                       log: "_required"
 *                       errors: []
 *                 message:
 *                   type: string
 *                   example: "Classroom already exists"
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
 *       '404':
 *         description: User not found
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
 *                   example: []
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
 *                     type: object
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Something went wrong!"
 *
 * /api/classroom/updateClassroom:
 *   put:
 *     summary: Update an existing classroom
 *     description: Updates an existing classroom's details, including capacity, name, description, and active status.
 *     operationId: updateClassroom
 *     tags:
 *       - Classroom
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
 *               classroomId:
 *                 type: string
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               active:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Classroom successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 classroom:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     capacity:
 *                       type: integer
 *                     active:
 *                       type: boolean
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
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Classroom does not exist"
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
 *                     type: object
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Something went wrong!"
 *
 * /api/classroom/getClassrooms:
 *   get:
 *     summary: Get all classrooms
 *     description: Fetches a paginated list of all classrooms for a school.
 *     operationId: getClassrooms
 *     tags:
 *       - Classroom
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
 *           default: 10
 *           description: The number of records to retrieve per page. Defaults to 10.
 *     responses:
 *       '200':
 *         description: Successful response with classroom data
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
 *                     classrooms:
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
 *                             example: ""
 *                           capacity:
 *                             type: integer
 *                             example: 0
 *                           schoolId:
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
 *                 error:
 *                   type: string
 *                   example: "Something went wrong!"
 *
 */
