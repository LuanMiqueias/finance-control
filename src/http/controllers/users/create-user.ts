import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "../../../errors/user-already-exists.error";

export const createUser = async (req: FastifyRequest, res: FastifyReply) => {
	const createUserBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { name, email, password } = createUserBodySchema.parse(req.body);

	try {
		return res.status(201).send({
			name,
			email,
			password,
			message: "User created successfully",
		});
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return res.status(409).send({ message: err.message });
		} else {
			return res.status(500).send(); //TODO: fix later
		}
	}
};
