import { createUser, getUserByEmail } from "../db/users"
import express from "express"
import { hasher, random } from "../helpers"

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.sendStatus(400)
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    )

    if (!user) {
      return res.sendStatus(400)
    }

    const expectedHash = hasher(user.authentication.salt, password)

    if (expectedHash !== user.authentication.password) {
      return res.sendStatus(403)
    }

    const salt = random()

    user.authentication.sessionToken = hasher(salt, user._id.toString())

    await user.save()

    res.cookie("FEMI", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    })
    return res.status(200).json(user).end()
  } catch (error) {
    return res.sendStatus(400)
  }
}

export const register = async (req: express.Request, res: express.Response) => {
  try {
    // Get the user input
    const { username, email, password } = req.body

    // Check for missing fields
    if (!username || !email || !password) {
      return res.sendStatus(400)
    }

    // Check if the user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return res.sendStatus(409)
    }

    // Create the user
    const salt = random()

    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: hasher(salt, password),
      },
    })

    return res.status(201).json(user).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
