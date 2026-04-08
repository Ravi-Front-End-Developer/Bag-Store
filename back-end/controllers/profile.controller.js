const { populate } = require("dotenv");
const profileModel = require("../models/profile-model");
const personalInfoModel = require("../models/personalInfo-model");
const addressModel = require("../models/address-model");

const getProfile = async (req, res) => {
  try {
    userProfile = await profileModel
      .findOne({ userId: req.user.id })
      .populate({
        path: "personalInfo",
        populate: { path: "primaryAddressId" },
      })
      .populate("defaultPaymentId");

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    let tempObj = {
      firstName: userProfile.personalInfo.firstName,
      lastName: userProfile.personalInfo.lastName,
      mobileNo: userProfile.personalInfo.mobileNo,
      email: userProfile.personalInfo.email,
      gender: userProfile.personalInfo.gender,
      profilePic: userProfile.personalInfo.profileImage,
      addressLine: userProfile.personalInfo.primaryAddressId.addressLine,
      dateOfBirth: userProfile.personalInfo.dateOfBirth,
      city: userProfile.personalInfo.primaryAddressId.city,
      state: userProfile.personalInfo.primaryAddressId.state,
      zipCode: userProfile.personalInfo.primaryAddressId.zipCode,
      country: userProfile.personalInfo.primaryAddressId.country,
      label: userProfile.personalInfo.primaryAddressId.label,
      otherLabel: userProfile.personalInfo.primaryAddressId.otherLabel,
      isDefault: userProfile.personalInfo.primaryAddressId.isDefault,
    };
    res.status(200).json({ message: "profile found", profile: tempObj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const saveProfileDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    console.log("--------------------data------------------");
    console.log(data);
    console.log("--------------------data------------------");
    console.log("--------------------req.file------------------");
    console.log(req.file);
    console.log("--------------------req.file------------------");
    const url = req.protocol + "://" + req.get("host");
    const personalInfo = await personalInfoModel.findOneAndUpdate(
      { userId },
      {
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNo: data.mobileNo,
        dateOfBirth: data.dateOfBirth,
        email: data.email,
        gender: data.gender,
        profileImage: url + "/images/" + req.file.filename,
      },
      { upsert: true, new: true },
    );

    const addressInfo = await addressModel.findOneAndUpdate(
      { userId },
      {
        label: data.label,
        addressLine: data.addressLine,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        isDefault: data.isDefault,
      },
      { upsert: true, new: true },
    );

    const profileInfo = await profileModel.findOneAndUpdate(
      { userId },
      {
        personalInfo: personalInfo._id,
      },
      { upsert: true, new: true },
    );

    personalInfo.primaryAddressId = addressInfo._id;

    await personalInfo.save();
    await addressInfo.save();
    res
      .status(200)
      .json({ message: "Profile synced successfully", profile: profileInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = { getProfile, saveProfileDetails };
