import s from '@/components/ui/genetal-css/general.module.css';
import { useState } from 'react';
import Image from "next/image";

const TimeRestrictions = ({ restrictOrdersTimes, setValue }) => {
    const [isCreateTime, setIsCreateTime] = useState(false);
    const [timeRangeCreate, setTimeRangeCreate] = useState('');
    const [timeRangeEdit, setTimeRangeEdit] = useState('');
    const [timeRangeError, setTimeRangeError] = useState('');
    const [editingIndex, setEditingIndex] = useState(-1);
    const [isEditing, setIsEditing] = useState(false);

    const addTime = () => {
        if (isEditing) {
            // Проверка на редактирование времени
            if (timeRangeEdit.trim() === '') {
                // Удаление времени из списка
                const times = restrictOrdersTimes ? restrictOrdersTimes.split('|') : [];
                times.splice(editingIndex, 1);
                setValue('restrictOrdersTimes', times.join('|'));
            } else {
                // Обновление существующего времени
                const timeFormat = /^(\d{2}:\d{2})-(\d{2}:\d{2})$/;
                if (timeFormat.test(timeRangeEdit)) {
                    const times = restrictOrdersTimes ? restrictOrdersTimes.split('|') : [];
                    times[editingIndex] = timeRangeEdit;
                    setValue('restrictOrdersTimes', times.join('|'));
                } else {
                    setTimeRangeError(
                        'Неправильный формат временного диапазона. Используйте формат ЧЧ:ММ-ЧЧ:ММ'
                    );
                    return;
                }
            }
        } else {
            // Проверка на создание нового времени
            if (timeRangeCreate.trim() === '') {
                // Поле пустое, ничего не делаем
                return;
            }

            const timeFormat = /^(\d{2}:\d{2})-(\d{2}:\d{2})$/;
            if (timeFormat.test(timeRangeCreate)) {
                const times = restrictOrdersTimes ? restrictOrdersTimes.split('|') : [];
                times.push(timeRangeCreate);
                setValue('restrictOrdersTimes', times.join('|'));
            } else {
                setTimeRangeError(
                    'Неправильный формат временного диапазона. Используйте формат ЧЧ:ММ-ЧЧ:ММ'
                );
                return;
            }
        }

        setTimeRangeCreate('');
        setTimeRangeEdit('');
        setIsCreateTime(false);
        setEditingIndex(-1);
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setTimeRangeEdit('');
    };

    return (
        <div className='mb-2 sm:mb-4 text-sm sm:text-base w-full col-span-2'>
            <div className='flex gap-4 items-center mb-2'>
                <label htmlFor="my_times" className="text-xs sm:text-base block mb-1 sm:font-bold">
                    Время ограничения
                </label>
                <button
                    onClick={(event) => {
                        setIsCreateTime(true);
                        event.preventDefault();
                    }}
                    className={`${s.easeInOut} px-4 py-0.5 bg-emerald-500 hover:bg-emerald-700 text-white font-bold rounded-xl hover:scale-110 active:scale-90 hover:shadow-xl`}
                >
                    +
                </button>
            </div>

            {restrictOrdersTimes && (
                <div className='flex flex-col gap-3'>
                    {restrictOrdersTimes.split("|").map((time, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {editingIndex === index && isEditing ? (
                                <>
                                    <input
                                        value={timeRangeEdit}
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                        onChange={(e) => setTimeRangeEdit(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className={`${s.easeInOut} px-4 py-2 bg-emerald-500 hover:bg-emerald-700 text-white font-bold rounded-xl hover:scale-110 active:scale-90 hover:shadow-xl`}
                                        onClick={addTime}
                                    >
                                        <Image src='/check.svg' alt='✔' width={25} height={25} />
                                    </button>
                                    <button
                                        type="button"
                                        className={`${s.easeInOut} px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-xl hover:scale-110 active:scale-90 hover:shadow-xl`}
                                        onClick={cancelEdit}
                                    >
                                        <Image src='/x-mark.svg' alt='Отмена' width={25} height={25} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        value={time}
                                        readOnly
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingIndex(index);
                                            setTimeRangeEdit(time);
                                            setIsEditing(true);
                                        }}
                                        className={`${s.easeInOut} px-4 py-2 bg-emerald-500 hover:bg-emerald-700 text-white font-bold rounded-xl hover:scale-110 active:scale-90 hover:shadow-xl`}
                                    >
                                        <Image src='/edit.svg' alt='редактировать' width={25} height={25} />
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isCreateTime && timeRangeError && (
                <p className="text-sm text-red-500 mb-1">{timeRangeError}</p>
            )}

            {isCreateTime && (
                <div className='flex items-center gap-2 mt-6'>
                    <input
                        className="border border-gray-300 p-2 rounded-lg w-full"
                        type="text"
                        placeholder='Введите Время ОТ и Время До через "-"'
                        value={timeRangeCreate}
                        onChange={(e) => {
                            setTimeRangeCreate(e.target.value);
                            setTimeRangeError('');
                        }}
                    />
                    <button
                        className={`${s.easeInOut} px-4 py-2 bg-emerald-500 hover:bg-emerald-700 text-white font-bold rounded-xl hover:scale-110 active:scale-90 hover:shadow-xl`}
                        onClick={(event) => {
                            addTime();
                            event.preventDefault();
                        }}
                    >
                        <Image src='/check.svg' alt='✔' width={25} height={25} />
                    </button>
                    <button
                        type="button"
                        className={`${s.easeInOut} px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-xl hover:scale-110 active:scale-90 hover:shadow-xl`}
                        onClick={() => {
                            setTimeRangeCreate('');
                            setIsCreateTime(false);
                            setIsEditing(false);
                        }}
                    >
                        <Image src='/x-mark.svg' alt='Отмена' width={25} height={25} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TimeRestrictions;