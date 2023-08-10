const doctorService = require('../services/doctors.js');
const { ctrlWrapper, HttpError, generateReceipt, sendEmail} = require('../helpers');
const pendingService = require('../services/registrationPending')
const patientService = require('../services/patients.js')
const fs = require("fs");


const getAllDoctors = async (req, res) => {
  let { search = '', limit = 5, page = 0, sort = 'first_name', position = '' } = req.query;
  limit = parseInt(limit);

  if (page !== 0) {
    page = parseInt(page) - 1;
  }

  const doctors = await doctorService.getAllDoctors(search, limit, page, sort, position);

  return res.status(200).json(doctors);
};

const createDoctor = async (req, res) => {

  const { email, name, position, password } = req.body;

  const doctor = await doctorService.registerDoctor(
      email, name, position, password
  );

  await pendingService.deleteByEmail(doctor.email)
      .then( () =>
          console.log('deleted by email:' + email)
      )

  res.status(201).json({
    email: doctor.email,
    name: doctor.name,
    pass: doctor.password
  });

};


const login = async (req, res) => {
  const { email, password } = req.body;

  const loginResponse = await doctorService.loginDoctor(email, password);

  res.json(loginResponse);
};

const updateDoctor = async (req, res) => {
  console.log("goes here")

  const updatedDoctor = await doctorService.updateDoctor(req.body, req.params.id, req.avatar);
  console.log(req.files)
  return res.status(200).json(updatedDoctor);
};

const deleteDoctor = async (req, res) => {
  const doctor = await doctorService.deleteDoctor(req.params.id);
  return res.status(201).json(doctor);
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;

  res.status(200).json({
    email,
    name,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await doctorService.updateDoctorsToken(_id, "");
  res.status(200).json({
    message: "Logout success",
  });
};

const getChats = async(req, res) => {

  const doctor = await doctorService.getDoctorById(req.params.id)

  res.status(200).json({
    chats: doctor.chats
  })
}

const getDoctorData = async(req, res) => {
  console.log(req.params.id)
  const doctor = await doctorService.getDoctorById(req.params.id)
  console.log(doctor)
  res.status(200).json({
    first_name: doctor.first_name,
    second_name: doctor.second_name,
    id: doctor._id,
    avatar: doctor.avatar,
    position: doctor.position,
    description: doctor.description
  })
}

const getProfileData = async(req, res) => {

  const doctor = await doctorService.getDoctorById(req.params.id)
  console.log(doctor)

  res.status(200).json({
    name: doctor.first_name + " " + doctor.second_name,
    email: doctor.email,
    position: doctor.position,
    description: doctor.description,
    avatar: doctor.avatar
  })

}

const updateProfileData = async(req, res) => {

  console.log(req.body)

  const doctor = await doctorService.getDoctorById(req.body.id)

  const {id, name, email, position, description, avatar} = req.body

  const updatedDoctor = {
    name: name,
    email: email,
    position: position,
    description: description
  }

  if(!doctor){
    throw new HttpError('404', "User not Found")
  }

  console.log(updatedDoctor)

  await doctorService.updateDoctor(updatedDoctor, id, avatar)

  res.status(200).json({
    msg: "Updated successfully"
  })

}


const updatePassword = async(req, res) => {

  console.log(req.body)

  const doctor = await doctorService.getDoctorById(req.body.id)

  const {id, password} = req.body

  console.log(...password)

  if(!doctor){
    throw new HttpError('404', "User not Found")
  }

  await doctorService.updatePassword(id, password)

  res.status(200).json({
    msg: "Updated successfully"
  })

}

const createReceipt = async(req,res) => {

  console.log(req.body)

  const {drugs, patient, doctor, description} = req.body

  const selectedDoctor = await doctorService.getDoctorById(doctor)
  const selectedPatient = await patientService.getPatientById(patient)

  console.log(selectedPatient, selectedDoctor)

  const template = {
    drugs: drugs,
    patient: selectedPatient.name,
    doctor: selectedDoctor.first_name+ " " + selectedDoctor.second_name,
    doctorsEmail: selectedDoctor.email,
    description: description
  }

  await generateReceipt(template)

  const pathToAttachment = '~/../receipt.pdf';
  const attachment = fs.readFileSync(pathToAttachment).toString("base64");

  const emailData = {

    to: selectedPatient.email,

    subject: 'Your prescriptions',

    html: '<p>Dear ' + selectedPatient.name +'</p>' +
        '<br/>' + '<p>Your prescrption by '+ selectedDoctor.first_name + ' ' +selectedDoctor.second_name +'</p>',
    attachments: [
      {
        content: attachment,
        filename: "prescription.pdf",
        type: "application/pdf",
        disposition: "attachment"
      }
    ]
  }

  await sendEmail(emailData)

  res.status(200).json({
    none: "none"
  })
}

module.exports = {
  getChats: ctrlWrapper(getChats),
  createReceipt: ctrlWrapper(createReceipt),
  updateProfileData: ctrlWrapper(updateProfileData),
  getProfileData: ctrlWrapper(getProfileData),
  updatePassword: ctrlWrapper(updatePassword),
  getData: ctrlWrapper(getDoctorData),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  getAllDoctors: ctrlWrapper(getAllDoctors),
  createDoctor: ctrlWrapper(createDoctor),
  updateDoctor: ctrlWrapper(updateDoctor),
  deleteDoctor: ctrlWrapper(deleteDoctor),
};
