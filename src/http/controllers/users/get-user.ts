import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "../../../errors/user-already-exists.error";

export const getUser = async (req: FastifyRequest, res: FastifyReply) => {
	try {
		return res.status(201).send({
			message: "Hello World",
		});
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return res.status(409).send({ message: err.message });
		} else {
			return res.status(500).send(); //TODO: fix later
		}
	}
};
