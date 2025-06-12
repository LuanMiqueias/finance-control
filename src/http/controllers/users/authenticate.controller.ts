import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { InvalidCreditialError } from "../../../use-cases/errors/invalid-credentials-error";
import { AuthenticateUseCase } from "../../../use-cases/user/authenticate";
import { PrismaUserRepository } from "../../../repositories/prisma/prisma-user-repository";

export const authenticate = async (req: FastifyRequest, res: FastifyReply) => {
	const AuthenticateBodySchema = z
		.object({
			email: z.string().email(),
			password: z.string(),
		})
		.strict({ message: "Extra parameters are not allowed" });

	const repository = new PrismaUserRepository();
	const authenticateUseCase = new AuthenticateUseCase(repository);

	const { email, password } = AuthenticateBodySchema.parse(req.body);

	try {
		const { user } = await authenticateUseCase.execute({
			email,
			password,
		});

		const token = await res.jwtSign(
			{},
			{
				sign: {
					sub: user?.id,
				},
			}
		);
		return res.status(200).send({
			token,
		});
	} catch (err) {
		if (err instanceof InvalidCreditialError) {
			return res.status(404).send({ message: err.message });
		} else {
			return res.status(500).send(); //TODO: fix later
		}
	}
};
