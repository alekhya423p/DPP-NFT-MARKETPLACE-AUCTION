import React, {useContext, useEffect} from 'react';
import * as Yup from "yup";
import { NftContext } from "../../NftContext/NftProvider";
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";
const Profile = () => {
    const { getprofile, profile, profileUpdate } = useContext(NftContext);


    const navitage = useNavigate()

    const validationSchema = yup.object({
      user_id: Yup.string().required('First name is required'),
      first_name: Yup.string().required('First name is required'),
      last_name: Yup.string().required('Last Name is required').test('last_name', 'Last name is required', (value) => value?.trim()),
      email: Yup.string().required('Email is required').email("Email is invalid").max(40, 'Email should be less than 40'),
    });
    const { register, handleSubmit,setValue, formState: { errors , ...formState} } = useForm({
      mode: 'onBlur',
      resolver: yupResolver(validationSchema),
    });
    const {isSubmitting} = formState;

    const onSubmit = async (values, e) => {
      profileUpdate(values, navitage)
    };
  

  useEffect(()=>{
    getprofile()
  },[])

  useEffect(() => {
    if (profile) {
      setValue('first_name', profile.first_name)
      setValue('last_name', profile.last_name)
      setValue('email', profile.email)
      setValue('user_id', profile.user_id)
    }
  },[profile, setValue])
  
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
                      <h3>User Profile</h3>
                      {/* <p className="mb-4">Lorem ipsum dolor sit amet elit. Sapiente sit aut eos consectetur adipisicing.</p> */}
                      {/* <div className="alert alert-success mt-2" style={{display: initialValues.successMessage ? 'block' : 'none' }} role="alert">
                  {initialValues.successMessage}
              </div> */}
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="form-group ">
                      <input type="hidden" className="form-control" placeholder='Ex:Scott'
                          {...register('user_id')}
                          name="first_name"
                          required="" />
                        <label htmlFor="username">First Name *</label>
                        <input type="text" className="form-control" placeholder='Ex:Scott'
                          {...register('first_name')} 
                          name="first_name"
                          required="" />
                        {errors.first_name && <span role="alert">{errors.first_name.message}</span>}
                      </div>
                      <div className="form-group ">
                        <label htmlFor="username">Last Name *</label>
                        <input type="text" className="form-control" placeholder='Ex:Pitts'
                          name="last_name"
                          {...register('last_name')}
                          required="" />
                        {errors.last_name  && (
                          <div className="text-danger pt-1">{errors.last_name.message}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="username">Email *</label>
                        <input type="text" className="form-control" placeholder='Ex:ScottCPitts@rhyta.com'
                          {...register('email')}
                          name="email"
                          required="" />
                        {errors.email && (
                          <div className="text-danger pt-1">{errors.email.message}</div>
                        )}
                      </div>
                     <button type="submit" disabled={isSubmitting} className="btn btn-block btn-primary custom-color-bttn mt-4">Update</button>
                     
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
  export default Profile