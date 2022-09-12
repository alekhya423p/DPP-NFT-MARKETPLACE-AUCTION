import React, {useContext} from 'react';
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { NftContext } from "../../NftContext/NftProvider";
import { useNavigate } from 'react-router';

const SignUp = () => {
  const { register } = useContext(NftContext);
  const navitage = useNavigate()
  const formik = useFormik({
    initialValues: {
      signup_fname: "",
      signup_lname: "",
      signup_email: "",
      signup_password: "",
      signup_cpassword: "",
      // signup_day: "",
      // signup_month: "",
      // signup_year: ""
    },
    validationSchema: Yup.object({
      signup_fname: Yup.string().required('First name is required'),
      signup_lname: Yup.string().required('Last Name is required').test('signup_lname', 'Last name is required', (value) => value?.trim()),
      // signup_day: Yup.string().required('Day is required').test('signup_day', 'Day is required', (value) => value?.trim()),
      // signup_year: Yup.string().required('Year is required'),
      // signup_month: Yup.string().required('Month is required'),
      signup_email: Yup.string().required('Email is required').email("Email is invalid").max(40, 'Email should be less than 40'),
      signup_password: Yup.string().min(8, 'Must be 8 characters or more').max(14, 'Password must be of 12 characters').required('Please Enter your password'),
      signup_cpassword: Yup.string().required('Confirm password is required').min(8, 'Must be 8 characters or less').oneOf([Yup.ref('signup_password'), null], 'Passwords must match'),
    }),
    onSubmit: (value, { resetForm }) => {
       register(value,navitage);
      //  onSubmitProps.setSubmitting(false);
      resetForm();

    },
  });


  return (
    <>
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-none d-sm-block">
              <img src="./undraw_remotely_2j6y.svg" alt="password" className="img-fluid" />
            </div>
            <div className="col-md-6 contents">
              <div className="row justify-content-center">
                <div className="col-md-12 col-lg-8">
                  <div className="mb-4">
                    <h3>Sign Up</h3>
                    <p className="mb-4">Lorem ipsum dolor sit amet elit. Sapiente sit aut eos consectetur adipisicing.</p>
                    {/* <div className="alert alert-success mt-2" style={{display: initialValues.successMessage ? 'block' : 'none' }} role="alert">
                {initialValues.successMessage}
            </div> */}
                  </div>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-group ">
                      <label htmlFor="username">First Name *</label>
                      <input type="text" className="form-control" placeholder='Ex:Scott'
                        {...formik.getFieldProps('signup_fname')}
                        name="signup_fname"
                        required="" />
                      {formik.touched.signup_fname && formik.errors.signup_fname ? (
                        <div className="text-danger pt-1">{formik.errors.signup_fname}</div>
                      ) : null}
                    </div>
                    <div className="form-group ">
                      <label htmlFor="username">Last Name *</label>
                      <input type="text" className="form-control" placeholder='Ex:Pitts'
                        name="signup_lname"
                        {...formik.getFieldProps('signup_lname')}
                        required="" />
                      {formik.touched.signup_lname && formik.errors.signup_lname ? (
                        <div className="text-danger pt-1">{formik.errors.signup_lname}</div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label htmlFor="username">Email *</label>
                      <input type="text" className="form-control" placeholder='Ex:ScottCPitts@rhyta.com'
                        {...formik.getFieldProps('signup_email')}
                        name="signup_email"
                        required="" />
                      {formik.touched.signup_email && formik.errors.signup_email ? (
                        <div className="text-danger pt-1">{formik.errors.signup_email}</div>
                      ) : null}
                    </div>
                    <div className="form-group last">
                      <label htmlFor="password">Password *</label>
                      <input type="password" className="form-control" placeholder='Ex:123@test'
                        {...formik.getFieldProps('signup_password')}
                        name="signup_password"
                        required="" />
                      {formik.touched.signup_password && formik.errors.signup_password ? (
                        <div className="text-danger pt-1">{formik.errors.signup_password}</div>
                      ) : null}
                    </div>
                    <div className="form-group last">
                      <label htmlFor="password">Confirm Password *</label>
                      <input type="password" className="form-control"
                        placeholder='Ex:123@test'
                        {...formik.getFieldProps('signup_cpassword')}
                        required=""
                        name="signup_cpassword" />
                      {formik.touched.signup_cpassword && formik.errors.signup_cpassword ? (
                        <div className="text-danger pt-1">{formik.errors.signup_cpassword}</div>
                      ) : null}
                    </div>
                    {/* <div className="form-group ">
                      <label htmlFor="username">Date Of Birth *</label>
                      <div className="d-flex ">
                        <div className="form-group col-md-4"> <input type="text" className="form-control"
                          name="signup_day"
                          {...formik.getFieldProps('signup_day')}
                          placeholder='Ex:1' required="" />
                          {formik.touched.signup_day && formik.errors.signup_day ? (
                            <div className="text-danger pt-1">{formik.errors.signup_day}</div>
                          ) : null}</div>
                        <div className="form-group col-md-4"> <input type="text" className="form-control"
                          name="signup_month"
                          {...formik.getFieldProps('signup_month')}
                          placeholder='Ex:March' required="" />
                          {formik.touched.signup_month && formik.errors.signup_month ? (
                            <div className="text-danger pt-1">{formik.errors.signup_month}</div>
                          ) : null}</div>
                        <div className="form-group col-md-4"> <input type="text" className="form-control"
                          name="signup_year"
                          {...formik.getFieldProps('signup_year')}
                          placeholder='Ex:1990' required="" />
                          {formik.touched.signup_year && formik.errors.signup_year ? (
                            <div className="text-danger pt-1">{formik.errors.signup_year}</div>
                          ) : null}</div>
                      </div>
                    </div> */}
                    <input type="submit" disabled={formik.isSubmitting } value="Sign Up" className="btn btn-block btn-primary custom-color-bttn mt-4" />
                    <span className="d-block text-center my-4 text-muted"> If you have an account? Please
                    &nbsp;<Link className="sign-link" to="/login" data-purpose="sign-up">
                        Login
                      </Link>
                    </span>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SignUp