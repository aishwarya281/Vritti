import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    if (!fullname || !email || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "user already exist",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });
    return res.status(201).json({
      message: "account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }
    let user = await User.findone({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // CHECK ROLE IS CORRECT OR NOT
    if (user.role !== role) {
      return res.status(400).json({
        message: "Account does not exist for this role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back, ${user.fullname}!`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    if (!fullname || !email || !phoneNumber || !bio || !skills) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }

    // cloudinary aayega ..

    const skillsArray = skills.split(",");
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    //UPDATING DATA
    user.fullname = fullname;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.profile.bio = bio;
    user.profile.skills = skillsArray;

    // RESUME COMES LATER HERE...

    await user.save();
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
