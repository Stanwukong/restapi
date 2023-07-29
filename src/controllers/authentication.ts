import { createUser, getUserByEmail } from "db/users";
import express from "express";
import { authentication, random } from "helpers";

export const register = async (req: express.Request, res: express.Response) => {
	try {
		// Get the user input
		const { username, email, password } = req.body;

		// Check for missing fields
		if (!username || !email || !password) 
		{
			return res.sendStatus(400);
		}

		// Check if the user already exists
		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return res.sendStatus(409);
		}

		// Create the user
		const salt = random();

		const user = await createUser({
			email,
			username,
			authentication: {
				salt,
				password: authentication(salt, password)
			}
		});

		return res.status(201).json(user).end();
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
}