import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { generateToken } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {

    try {
        const {username, email, password, role} = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid email format"});
        }

        const existingUser = await User.findOne({where : {username}});
        if(existingUser){
            return res.status(400).json({error: "Username is already taken"});
        }

        const existingEmail = await User.findOne({where : {email}});
        if(existingEmail){
            return res.status(400).json({message: 'Email is already taken'});
        }

        if(password.length < 6){
            return res.status(400).json({error: "Password must be atleast 6 characters long"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({username, email, password: hashedPassword, role});

        res.status(201).json({message: 'User registered successfully', newUser});
    } catch (error) {
        console.log("Error Registering User", error.message);        
        res.status(500).json({error: 'Error registering user', error});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({where : {email}});
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const isPasswordValid = await bcrypt.compare(password, user?.password || "");
        if(!isPasswordValid){
            return res.status(401).json({message: 'Invalid Password'});
        }

        // Generate JWT
        // const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {
        //     expiresIn: '1h',
        // });

        const token = generateToken(user.id, user.role, res);

        res.status(200).json({message: 'Login successful', token});
        // res.status(200).json({
        //     _id: user._id,
        //     username: user.username,
        //     email: user.email,
        //     role: user.role,
        // })
    } catch (error) {
        console.log('Cannot Login user', error.message);
        res.status(500).json({error: 'Error logging in', error});
    }
};


export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "token", {maxAge: 1});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Cannot logout user", error.message);
        res.status(500).json({error: "Error logging out"}, error);
    }
};

export const getMe = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findByPk(id, {attributes: {exclude: ["password"]}});
        res.status(200).json(user);
    } catch (error) {
        console.log("Error fetching user profile", error.message);
        res.status(500).json({error: "Error fetching user profile"});
    }
};

export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users, excluding passwords
        const users = await User.findAll({ attributes: { exclude: ["password"] } });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.log("Error fetching all users", error.message);
        res.status(500).json({ error: "Error fetching all users" });
    }
};


export const update = async (req, res) => {
    const { oldPassword, newPassword } = req.body;  // Assuming both oldPassword and newPassword are passed in the request body
    const userId = req.user.id;  // Get the logged-in user's ID from the JWT token
  
    try {
      // Validate the new password
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }
  
      // Find the user by their ID
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the old password matches the current password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return res.status(400).json({ error: "Old password is incorrect" });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully" });
  
    } catch (error) {
      console.log("Error updating password:", error.message);
      res.status(401).json({ error: "Error updating password", message: error.message });
    }
};


// export const getAllUsers = async (req, res) => {
//     try {
//       // Fetch all users, excluding their passwords
//       const users = await User.findAll({ attributes: { exclude: ["password"] } });
//       console.log("Error", error.message);
      
//       res.status(200).json(users);  // Send the list of users as the response
//     } catch (error) {
//       console.error("Error fetching users", error.message);
//       res.status(500).json({ error: "Error fetching users" });
//     }
//   };
  





// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// // Signup Controller
// export const signup = async (req, res) => {
//     try {
//         console.log("Request body:", req.body);
//         const { username, email, password, role } = req.body;

//         // Validate email format
//         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         if (!emailRegex.test(email)) {
//             console.log("Invalid email format:", email);
//             return res.status(400).json({ error: "Invalid email format" });
//         }

//         // Check if username already exists
//         const existingUser = await User.findOne({ where: { username } });
//         if (existingUser) {
//             return res.status(400).json({ error: "Username is already taken" });
//         }

//         // Check if email already exists
//         const existingEmail = await User.findOne({ where: { email } });
//         if (existingEmail) {
//             return res.status(400).json({ message: "Email is already taken" });
//         }

//         // Validate password length
//         if (!password || password.length < 6) {
//             return res.status(400).json({ error: "Password must be at least 6 characters long" });
//         }

//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create new user
//         const newUser = await User.create({ username, email, password: hashedPassword, role });

//         res.status(201).json({ message: "User registered successfully", newUser });
//     } catch (error) {
//         console.error("Error Registering User", error);
//         res.status(500).json({ message: "Error registering user", error });
//     }
// };

// // Login Controller
// export const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Check if user exists
//         const user = await User.findOne({ where: { email } });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Compare passwords
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Invalid password" });
//         }

//         // Generate JWT
//         const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
//             expiresIn: "1h",
//         });

//         res.status(200).json({ message: "Login successful", token });
//     } catch (error) {
//         console.error("Cannot login user", error);
//         res.status(500).json({ message: "Error logging in", error });
//     }
// };
