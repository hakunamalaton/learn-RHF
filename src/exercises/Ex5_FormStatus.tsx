import { useForm, type Control, useFormState } from "react-hook-form";

interface FormValues {
    displayName: string;
    email: string;
    emailFrequency: 'daily' | 'weekly' | 'never'
    marketingEmails: boolean;
}

function FormStatusBar<T extends FormValues>({ control }: { control: Control<T> }) {
    const context = useFormState<T>({ control })
    const errorKeys = Object.keys(context.errors)

    return (
        <>
            <div>Dirty indicator: {`${context.isDirty}`}</div>
            <div>Valid indicator: {`${context.isValid}`}</div>
            <div>Submitting spinner: {`${context.isSubmitting}`}</div>
            <div>Submit count: {context.submitCount}</div>
            {errorKeys.length && <div>List of current error messages: {
                errorKeys.map(key => context.errors[key]?.message)
            }</div>}
            <div>List of dirty field names: {Object.entries(context.dirtyFields ?? {})}</div>
        </>
    )
}

export default function Ex5_FormStatus() {
    const { register, control, handleSubmit, formState: { isDirty, isValid, isSubmitting } } = useForm<FormValues>({
        defaultValues: {
            displayName: '',
            email: '',
            emailFrequency: 'daily',
            marketingEmails: false,
        },
        mode: 'onBlur',
    });

    console.log('form rendered')

    async function onSubmit (data: FormValues) {
        await new Promise(r => setTimeout(r, 1500))
        console.log(data)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} >
                <input {...register('displayName', { required: 'Display name is required' })} placeholder="Display Name" />
                <input {...register('email', { required: 'Email is required' })} placeholder="Email" />
                <select {...register('emailFrequency', { required: 'Email frequency is required' })}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="never">Never</option>
                </select>
                <input type="checkbox" 
                    {...register('marketingEmails')}
                />

                <input
                    type="submit" 
                    disabled={!isDirty || !isValid || isSubmitting}
                />
            </form>
            
            <FormStatusBar control={control} />
        </>
    )
}
