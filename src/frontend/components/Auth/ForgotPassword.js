import React, {useContext} from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { NftContext } from "../../NftContext/NftProvider";
import { useNavigate } from 'react-router';

const Forgot = () => {
  const navitage = useNavigate()
  const { forgotPassword } = useContext(NftContext);

  const formik = useFormik({
    initialValues: {
        username: '',
    },
    validationSchema: Yup.object({
        username: Yup.string().required('Email is required').email("Email is not valid"),
    }),
    onSubmit: (value, { resetForm }) => {
      forgotPassword(value, navitage)
        // dispatch(getUserByEmail(value, navigate))
        // resetForm();
    },
});
  return (
    <>
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-none d-sm-block">
              <img src="./forgot-password-concept-flat.png" alt="password" className="img-fluid" />
            </div>
            <div className="col-md-6 contents">
              <div className="row justify-content-center">
                <div className="col-md-12 col-lg-8">
                  <div className="mb-4">
                    <h3>Forgot Password</h3>
                    <p className="mb-4">Lorem ipsum dolor sit amet elit. Sapiente sit aut eos consectetur adipisicing.</p>
                    <p className="text-primary"></p>
                  </div>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="username">Email *</label>
                      <input type="text" className="form-control" placeholder='Ex:ScottCPitts@rhyta.com'
                        {...formik.getFieldProps('username')}
                        name="username"
                        required="" />
                      {formik.touched.username && formik.errors.username ? (
                          <div className="text-danger p-1">{formik.errors.username}</div>
                      ) : null}
                    </div>
                    <input type="submit" value="Submit" className="btn btn-block btn-primary custom-color-bttn mt-4" />
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
export default Forgot