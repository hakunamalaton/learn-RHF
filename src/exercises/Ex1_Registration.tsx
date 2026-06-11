import { useForm } from "react-hook-form";

export default function Ex1Registration() {
  const {
    register,
    handleSubmit,
    getValues,

    formState: { errors },
  } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <form
      className="flex flex-col items-start gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
        <div className="flex items-start gap-1 w-full">
          <label htmlFor="username" className="mt-2 w-1/4">Username: </label>
          <div className="flex flex-col items-start gap-1 w-full">
            <input
              className="border-2 border-gray-300 p-2 rounded-md w-full"
              id="username"
              {...register('username', { required: true, minLength: 3, maxLength: 20 })}
            />
            <span className="text-red-500 text-sm">
              {errors.username && <span>Username is required and must be between 3 and 20 characters</span>}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-1 w-full">
          <label htmlFor="email" className="mt-2 w-1/4">Email: </label>
          <div className="flex flex-col items-start gap-1 w-full">
            <input
              className="border-2 border-gray-300 p-2 rounded-md w-full"
              id="email"
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            />
            <span className="text-red-500 text-sm">
              {errors.email && <span>Email is required and must be a valid email address</span>}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-1 w-full">
          <label htmlFor="password" className="mt-2 w-1/4 ">Password: </label>
          <div className="flex flex-col items-start gap-1 w-full">
            <input
              className="border-2 border-gray-300 p-2 rounded-md w-full"
              id="password"
              type="password"
              {...register('password', { 
                required: true,
                minLength: 8,
                validate: (value) => {
                  const hasOneUpperCase = /[A-Z]/.test(value);
                  const hasOneNumber = /[0-9]/.test(value);

                  return hasOneUpperCase && hasOneNumber || "Password must contain at least one uppercase letter and one number";

              }})} />
            <span className="text-red-500 text-sm">
              {errors.password && <span>Password is required, must be at least 8 characters long, and contain at least one uppercase letter and one number</span>}
            </span>
          </div>
        </div>
        
        <div className="flex items-start gap-1 w-full">
          <label htmlFor="confirmPassword" className="mt-2 w-1/4">Confirm Password: </label>
          <div className="flex flex-col items-start gap-1 w-full">
            <input
              className="border-2 border-gray-300 p-2 rounded-md w-full"
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', { 
                required: true,
                minLength: 8,
                validate: (value) => {
                  return value === getValues('password');
                }
              })} />
            <span className="text-red-500 text-sm">
              {errors.confirmPassword && <span>Confirm Password is required and must match the password</span>}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-1 w-full justify-start">
          <label htmlFor="age" className="mt-2 w-1/4">Age: </label>
          <div className="flex flex-col items-start gap-1 w-full">
            <input
              className="border-2 border-gray-300 p-2 rounded-md"
              id="age"
              type="number"
              {...register('age', { required: true, min: 18, max: 120 })}
            />
            <span className="text-red-500 text-sm">
              {errors.age && <span>Age is required and must be between 18 and 120</span>}
            </span>
          </div>
        </div>

      <label htmlFor="agreeToTerms">
        <input
          className="mr-2"
          id="agreeToTerms"
          {...register('agreeToTerms', { required: true })}
          type="checkbox"
        />
        I agree to the terms
      </label>
      <span className="text-red-500 text-sm">
        {errors.agreeToTerms && <span>You must agree to the terms</span>}
      </span>

      <input type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:cursor-pointer" />
    </form>
  );
}
