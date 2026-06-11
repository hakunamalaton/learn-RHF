import { FormProvider, useForm, useFormContext } from 'react-hook-form';

type PersonalInfo = {
    firstName: string;
    lastName: string;
    email: string;
}

type ExperienceInfo = {
    yearsOfExperience: number;
    currentRole: string;
}

type AvailabilityInfo = {
    startDate: Date;
    remoteOnly: boolean;
}

type FormData = PersonalInfo & ExperienceInfo & AvailabilityInfo;

function PersonalSection () {
    const { register } = useFormContext<PersonalInfo>();

    return (
        <>
            <input
                {...register('firstName', { required: 'First name is required' })}
                placeholder="First Name"
            />
            <input
                {...register('lastName', { required: 'Last name is required' })}
                placeholder="Last Name"
            />
            <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                placeholder="Email"
            />
        </>
    )
}

function ExperienceSection () {
    const { register } = useFormContext<ExperienceInfo>();
    console.log('ExperienceSection rendered');

    return (
        <>
            <input
                type="number"
                {...register('yearsOfExperience', {
                    required: 'Years of experience is required',
                    min: { value: 0, message: 'Years must be a positive number' },
                    max: { value: 50, message: 'Years must be less than or equal to 50' },
                    valueAsNumber: true
                })}
                placeholder="Years of Experience"
            />
            <input
                {...register('currentRole', { required: 'Current role is required' })}
                placeholder="Current Role"
            />
        </>
    )
}

function AvailabilitySection () {
    const { register } = useFormContext<AvailabilityInfo>();

    return (
        <>
            <input
                type="date"
                {...register('startDate', {
                    required: 'Start date is required',
                    valueAsDate: true
                })}
                placeholder="Start Date"
            />
            <label htmlFor="remoteOnly">Remote Only
                <input
                    type="checkbox"
                    id="remoteOnly"
                    {...register('remoteOnly')}
                />
            </label>
        </>
    )
}


export default function Ex3_FormContext() {
    const methods = useForm<FormData>({ mode: 'onBlur' })
    async function onSubmit(data: FormData) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // fake async submission
        console.log(data);
    }

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <PersonalSection />
                    <ExperienceSection />
                    <AvailabilitySection />

                    <input type="submit" />
                </form>
            </FormProvider>

            <div>
                {`First name is: ${methods.watch('firstName')}, Last name is: ${methods.watch('lastName')}, Email is: ${methods.watch('email')}, Years of experience is: ${methods.watch('yearsOfExperience')}, Current role is: ${methods.watch('currentRole')}, Start date is: ${methods.watch('startDate')}, Remote only: ${methods.watch('remoteOnly')}`}
            </div>
        </>
    );
}

// answer key questions:
//   1. What re-rendering behaviour do you observe compared to Exercise 1? type in a child component -> parent component re-renders -> all child components re-render

//   2. Which components re-render when you type in PersonalSection? Ex3_FormContext re-renders -> all 3 child components re-render

// Both observations are correct, but the important follow-up is why — and it points directly to what Exercise 4 fixes.

// Why the parent re-renders at all

// RHF uses uncontrolled inputs. Typing into a field does not trigger a React re-render by itself — the DOM handles it. The parent only re-renders because you called watch() (or methods.watch(...)) inside it. That call subscribes the parent component to field changes. Remove every watch() call and nothing would re-render when you type.

// So the re-render cascade is self-inflicted by watch() placement:

// watch() called in parent
//   → parent subscribes to all field changes
//   → any keystroke re-renders the parent
//   → React re-renders all 3 children as a side effect

// Comparison to Exercise 1

// The behaviour is actually identical to Ex1. Calling watch('username') in Ex1 subscribes that component to username changes — same mechanism, same cost. useFormContext doesn't change the re-render story; it only moves the form access into children via context.
