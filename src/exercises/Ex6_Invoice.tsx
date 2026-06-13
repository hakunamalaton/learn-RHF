import { FormProvider, useFieldArray, useForm, useFormContext, useWatch, type Control } from 'react-hook-form'

interface FormData {
    clientName: string
    invoiceDate: Date
    currency: 'USD' | 'EUR' | 'GBP'
    items: {
        description: string
        quantity: number
        unitPrice: number
    }[]
}

function LineItem ({ control }: { control: Control<FormData> }) {
    const {
        fields,
        append,
        remove,
        move,
    } = useFieldArray({
        control,
        name: 'items'
    })
    const { register } = useFormContext()

    const subTotal = useWatch({
        control,
        name: 'items',
    })
    console.log('subTotal: ', subTotal);

    function onDeleteRow (index: number) {
        remove(index)
    }

    function onMoveUp(index: number) {
        move(index, index - 1)
    }

    function onMoveDown(index: number) {
        move(index, index + 1)
    }

    return (
        <>
            {
                fields.map((field, index) => {
                    return (
                        <div
                            className='flex my-2 gap-2 justify-center'
                            key={field.id}
                        >
                            <div className='flex flex-col gap-2'>
                                <div>Description:
                                    <input
                                        className='border ml-2'
                                        {...register(`items.${index}.description`, { required: 'Description is required! '})}
                                    />
                                </div>
                                <div>Quantity:
                                    <input
                                        className='border ml-2'
                                        type="number"
                                        {...register(`items.${index}.quantity`, {
                                            required: 'Quantity is required',
                                            valueAsNumber: true,
                                            min: 1,
                                            validate: (value) => Number.isInteger(value),
                                        })}
                                    />    
                                </div>
                                <div>Unit price:
                                    <input
                                        className='border ml-2'
                                        type="number"
                                        {...register(`items.${index}.unitPrice`, {
                                            required: 'Unit price is required',
                                            valueAsNumber: true,
                                            min: 0,
                                        })}
                                    />
                                </div>
                                <div>Sub total: {subTotal[index]?.quantity * subTotal[index]?.unitPrice}</div>
                            </div>

                            <div className='flex gap-2'>
                                <button
                                    className='border'
                                    onClick={() => onDeleteRow(index)}
                                    disabled={fields.length === 1}
                                >
                                    Remove
                                </button>
                                <button
                                    disabled={index === 0}
                                    className='border px-2'
                                    onClick={() => onMoveUp(index)}
                                >
                                    ↑
                                </button>
                                <button
                                    disabled={index === fields.length - 1}
                                    className='border px-2'
                                    onClick={() => onMoveDown(index)}
                                >
                                    ↓
                                </button>
                            </div>
                        </div>
                    )
                })
            }
            <div>
                Grand total: {subTotal.reduce(
                    (prev, curr) => curr.quantity * curr.unitPrice + prev,
                    0,
                )}
            </div>
            <button
                className='border'
                onClick={() => append({
                    description: '',
                    quantity: 1,
                    unitPrice: 0,
                })}
            >Add item</button>
        </>
    )
}

export default function Ex6Invoice () {
    const methods = useForm<FormData>({
        defaultValues: {
            items: [
                {
                    description: '',
                    quantity: 1,
                    unitPrice: 0
                }
            ]
        },
        mode: 'onBlur',
    })
    const { fields } = useFieldArray({
        control: methods.control,
        name: 'items',
    })

    function onSubmit (data: FormData) {
        if (fields.length === 0) {
            throw new Error('Empty Line Item')
        }
        console.log(data);
    }
    console.log('ex6 re-renders')


    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <input
                    className='border'
                    placeholder='Add client name'
                    {...methods.register('clientName', { required: 'Client name is required' })}
                />
                <input 
                    {...methods.register('invoiceDate', { required: 'Invoice date is required' })}
                    type="date"
                />
                <select
                    {...methods.register('currency', { required: 'Currency is required' })}
                >
                    <option value='usd'>USD</option>
                    <option value='eur'>EUR</option>
                    <option value='GBP'>GBP</option>
                </select>

                <LineItem control={methods.control} />

                <input className="block w-full" type="submit" />
            </form>
        </FormProvider>
    )
}
