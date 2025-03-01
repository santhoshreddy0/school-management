/**
 * @swagger
 * /api/student/enroll:
 *   post:
 *     summary: Enroll a student in a classroom
 *     description: Enrolls a student into a specified classroom using their email.
 *     operationId: enrollStudent
 *     tags:
 *       - Student
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
 *               classId:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Student successfully enrolled in the classroom
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 enrollmentDetails:
 *                   type: object
 *                   properties:
 *                     classId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     user_id:
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
 *                     - label: "email"
 *                       path: "email"
 *                       message: "email is required"
 *                       log: "_required"
 *                       errors: []
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
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
 *       '409':
 *         description: User already enrolled in the classroom
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
 *                   example: "Already enrolled in the class"
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
 *
 * /api/student/transfer:
 *   put:
 *     summary: Transfer a student from one classroom to another
 *     description: Transfers a student from their current classroom to a new classroom based on the provided email.
 *     operationId: transferStudent
 *     tags:
 *       - Student
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
 *               presentClassId:
 *                 type: string
 *               newClassId:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Student successfully transferred to the new classroom
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 transferDetails:
 *                   type: object
 *                   properties:
 *                     classId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     user_id:
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
 *                     - label: "presentClassId"
 *                       path: "presentClassId"
 *                       message: "presentClassId and newClassId cannot be the same"
 *                       log: "_same"
 *                       errors: []
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *       '404':
 *         description: Classroom not found
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
 *                   example: "Classroom not found"
 *       '409':
 *         description: Enrollment already exists in the new classroom
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
 *                   example: "Student is already enrolled in the new class"
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
 */
