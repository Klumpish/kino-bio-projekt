import { prisma } from '../../../prisma/prisma-client.js';
import jsonwebtoken from 'jsonwebtoken';
const JWT_SECRET = 'MyVeryLongSeceetKeyCouldBeGeneratedBySomeGenerator';
import bcrypt from 'bcryptjs';

const login = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const b64credentials = authHeader.slice(6);
    const credentials = atob(b64credentials);
    const [username, password] = credentials.split(':');

    if (password === 'default') {
      const jwt = jsonwebtoken.sign(
        {
          username: username,
          verified: true,
          isLoggedIn: true,
        },
        JWT_SECRET
      );

      res.status(200).json({
        token: jwt,
        user: {
          username: username,
          verified: true,
          isLoggedIn: true,
        },
      });
    } else {
      res.status(401).json({
        user: {
          username: 'Guest',
          isLoggedIn: false,
        },
        message: 'Invalid credentials',
      });
    }
  } catch (err) {
    res.status(500).json({
      user: {
        username: 'Guest',
        isLoggedIn: false,
      },
      message: err.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.slice(7);

    const payload = jsonwebtoken.verify(token, JWT_SECRET);

    res.status(200).json({
      user: {
        username: payload.username,
        isVerified: payload.verified,
        isLoggedIn: payload.isLoggedIn,
      },
    });
  } catch (err) {
    res.status(401).json({
      user: {
        username: 'Guest',
        isLoggedIn: false,
      },
      message: 'Not authorized',
    });
  }
};

const newLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    const isPasswordValid = user && (await bcrypt.compare(password, user.password));

    if (user && isPasswordValid && process.env.JWT_SECRET) {
      res.status(200).json({
        id: user.id,
        email: user.email,
        token: jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }),
      });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in user' });
  }
};

const register = async (req, res) => {
  try {
    const { email, number, password } = req.body;
    console.log(req.body);
    if (!email || !number || !password) {
      return res.status(400).json({ message: 'Email, phone and password are required' });
    }

    const registeredUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (registeredUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        number,
        password: hashedPassword,
      },
    });

    if (newUser && process.env.JWT_SECRET) {
      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        number: newUser.phone,
        token: jsonwebtoken.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' }),
      });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering user' });
  }
};

const current = async (req, res) => {
  return res.status(200).json(req.user);
};

export { login, getUser, newLogin, register, current };
