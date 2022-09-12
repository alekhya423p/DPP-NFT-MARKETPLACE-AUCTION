import React, {useState,useContext} from 'react';
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from 'formik';
import { NftContext } from "../../NftContext/NftProvider";
import { useNavigate } from 'react-router';



const SignIn = () => {
  const navitage = useNavigate()
  const { login } = useContext(NftContext);
  const [logIn, setLoginIn] = useState('Log In');

  const formik = useFormik({
    initialValues: {
      password: '',
      username: '',
      rememberMe: false,
      // logIn:'Please wait'
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Email is required').email("Email is not valid"),
      password: Yup.string().max(14, 'Must be 12 characters or less').min(8, 'Must be 6 characters or more').required('Please Enter your password'),
      rememberMe: Yup.boolean()
    }),
    
    onSubmit: (value, { resetForm }) => {
     login(value, navitage)
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
                    <h3>Sign In</h3>
                    <p className="mb-4">Lorem ipsum dolor sit amet elit. Sapiente sit aut eos consectetur adipisicing.</p>
                  </div>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="username">Email *</label>
                      <input type="text" className="form-control" placeholder='Ex:ScottCPitts@rhyta.com'
                        name="username"
                        {...formik.getFieldProps('username')}
                        required="" />
                      {formik.touched.username && formik.errors.username ? (
                        <div className="text-danger">{formik.errors.username}</div>
                      ) : null}
                    </div>
                    <div className="form-group last">
                      <label htmlFor="password">Password *</label>
                      <input type="password" className="form-control" placeholder='Ex:123@test'
                        name="password"
                        {...formik.getFieldProps('password')}
                        required="" />
                      {formik.touched.password && formik.errors.password ? (
                        <div className="text-danger">{formik.errors.password}</div>
                      ) : null}
                    </div>
                    <div className="d-flex mb-4 align-items-center">
                      <label className="control control--checkbox mb-0"><span className="caption">Remember me</span>
                        <input type="checkbox" />
                        <div className="control__indicator"></div>
                      </label>
                      <span className="ml-auto">
                        <Link className="forgot-pass" to="/forgot-password" data-purpose="forgot-pass">
                          Forgot Password
                        </Link></span>
                    </div>
                    <input type="submit" disabled={formik.isSubmitting } value={logIn} className="btn btn-block btn-primary custom-color-bttn" />
                    <span className="d-block text-center my-4 text-muted"> If you Don't have an account? Please
                    &nbsp;<Link className="sign-link" to="/register" data-purpose="sign-up">
                   Sign up
                      </Link></span>
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
export default SignIn