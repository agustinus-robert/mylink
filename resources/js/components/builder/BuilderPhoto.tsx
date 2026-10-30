import React, { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { FilePond, registerPlugin } from 'react-filepond';
import type { FilePondFile } from 'filepond';
import Cropper, { type Area } from 'react-easy-crop';

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export type BuilderImageValue = File | string | null;

export interface BuilderImages {
    desktop: BuilderImageValue;
    tablet: BuilderImageValue;
    mobile: BuilderImageValue;
}

interface BuilderPhotoProps {
    images: BuilderImages;
    setImages: (images: BuilderImages) => void;
}

interface ImageUploaderProps {
    label: string;
    value: BuilderImageValue;
    aspectRatio: number;
    onChange: (file: File | null) => void;
}

async function createCroppedImage(
    imageSrc: string,
    crop: Area,
    originalName: string,
): Promise<File> {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Gagal membaca gambar.'));
        img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas tidak tersedia.');
    }

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height,
    );

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (result) => {
                if (!result) {
                    reject(new Error('Gagal membuat hasil crop.'));
                    return;
                }

                resolve(result);
            },
            'image/jpeg',
            0.9,
        );
    });

    const name = originalName.replace(/\.[^/.]+$/, '') + '-cropped.jpg';

    return new File([blob], name, {
        type: 'image/jpeg',
    });
}

async function loadRemoteImage(url: string): Promise<File> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Gagal mengambil gambar (${response.status}).`);
    }

    const blob = await response.blob();

    const pathname = new URL(url, window.location.origin).pathname;

    const filename = pathname.split('/').pop() || 'image.jpg';

    return new File([blob], filename, {
        type: blob.type || 'image/jpeg',
    });
}

function ImageUploader({
    label,
    value,
    aspectRatio,
    onChange,
}: ImageUploaderProps) {
    const pondRef = useRef<any>(null);

    const onChangeRef = useRef(onChange);

    const existingFileRef = useRef<File | null>(null);

    const croppedFileRef = useRef<File | null>(null);

    const isCroppingRef = useRef(false);

    const loadedUrlRef = useRef<string | null>(null);

    const requestIdRef = useRef(0);

    const [files, setFiles] = useState<File[]>([]);

    const [cropImage, setCropImage] = useState<string | null>(null);

    const [cropFile, setCropFile] = useState<File | null>(null);

    const [crop, setCrop] = useState({
        x: 0,
        y: 0,
    });

    const [zoom, setZoom] = useState(1);

    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    );

    const [processingCrop, setProcessingCrop] = useState(false);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        const requestId = ++requestIdRef.current;

        let cancelled = false;

        async function loadValue() {
            if (!value) {
                loadedUrlRef.current = null;

                existingFileRef.current = null;

                croppedFileRef.current = null;

                setFiles([]);

                return;
            }

            if (value instanceof File) {
                loadedUrlRef.current = null;

                existingFileRef.current = null;

                croppedFileRef.current = value;

                setFiles([value]);

                return;
            }

            if (loadedUrlRef.current === value && files.length > 0) {
                return;
            }

            try {
                const file = await loadRemoteImage(value);

                if (cancelled || requestId !== requestIdRef.current) {
                    return;
                }

                existingFileRef.current = file;

                croppedFileRef.current = null;

                loadedUrlRef.current = value;

                setFiles([file]);
            } catch (error) {
                if (cancelled || requestId !== requestIdRef.current) {
                    return;
                }

                console.error('Gagal memuat gambar:', error);

                loadedUrlRef.current = null;

                existingFileRef.current = null;

                setFiles([]);
            }
        }

        loadValue();

        return () => {
            cancelled = true;
        };
    }, [value]);

    function handleUpdateFiles(fileItems: FilePondFile[]) {
        if (isCroppingRef.current) {
            return;
        }

        if (!fileItems.length) {
            if (existingFileRef.current || croppedFileRef.current) {
                return;
            }

            setFiles([]);

            onChangeRef.current(null);

            return;
        }

        const file = fileItems[0]?.file;

        if (!(file instanceof File)) {
            return;
        }

        if (existingFileRef.current === file) {
            return;
        }

        if (croppedFileRef.current === file) {
            return;
        }

        const url = URL.createObjectURL(file);

        setCropFile(file);

        setCropImage(url);

        setCrop({
            x: 0,
            y: 0,
        });

        setZoom(1);

        setCroppedAreaPixels(null);
    }

    function handleCropComplete(_area: Area, areaPixels: Area) {
        setCroppedAreaPixels(areaPixels);
    }

    async function handleUseImage() {
        if (!cropImage || !cropFile || !croppedAreaPixels) {
            return;
        }

        try {
            setProcessingCrop(true);

            isCroppingRef.current = true;

            const croppedFile = await createCroppedImage(
                cropImage,
                croppedAreaPixels,
                cropFile.name,
            );

            URL.revokeObjectURL(cropImage);

            croppedFileRef.current = croppedFile;

            existingFileRef.current = null;

            loadedUrlRef.current = null;

            setCropImage(null);

            setCropFile(null);

            setCrop({
                x: 0,
                y: 0,
            });

            setZoom(1);

            setCroppedAreaPixels(null);

            setFiles([croppedFile]);

            onChangeRef.current(croppedFile);
        } catch (error) {
            console.error('Crop gagal:', error);
        } finally {
            setProcessingCrop(false);

            setTimeout(() => {
                isCroppingRef.current = false;
            }, 300);
        }
    }

    function handleCancelCrop() {
        if (cropImage) {
            URL.revokeObjectURL(cropImage);
        }

        setCropImage(null);

        setCropFile(null);

        setCrop({
            x: 0,
            y: 0,
        });

        setZoom(1);

        setCroppedAreaPixels(null);

        if (value instanceof File) {
            setFiles([value]);

            return;
        }

        if (existingFileRef.current) {
            setFiles([existingFileRef.current]);
        }
    }

    async function handleCropAgain() {
        if (!value) {
            return;
        }

        try {
            let file: File;

            if (value instanceof File) {
                file = value;
            } else {
                file = await loadRemoteImage(value);
            }

            const url = URL.createObjectURL(file);

            setCropFile(file);

            setCropImage(url);

            setCrop({
                x: 0,
                y: 0,
            });

            setZoom(1);

            setCroppedAreaPixels(null);
        } catch (error) {
            console.error('Gagal membuka gambar:', error);
        }
    }

    return (
        <>
            <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                    {label}
                </label>

                <FilePond
                    ref={pondRef}
                    files={files}
                    allowMultiple={false}
                    allowReorder={false}
                    allowProcess={false}
                    allowRevert={false}
                    acceptedFileTypes={[
                        'image/jpeg',
                        'image/png',
                        'image/webp',
                    ]}
                    labelIdle={
                        'Drag & Drop gambar atau <span class="filepond--label-action">Pilih File</span>'
                    }
                    labelFileTypeNotAllowed="Format gambar tidak didukung"
                    fileValidateTypeLabelExpectedTypes="JPEG, PNG, WEBP"
                    credits={false}
                    onupdatefiles={handleUpdateFiles}
                />

                {value && (
                    <button
                        type="button"
                        onClick={handleCropAgain}
                        className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
                    >
                        Crop Ulang
                    </button>
                )}
            </div>

            {cropImage && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
                    <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
                        <div className="border-b border-slate-700 px-5 py-4">
                            <h3 className="font-semibold text-slate-100">
                                Crop {label}
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                                Sesuaikan posisi gambar.
                            </p>
                        </div>

                        <div className="relative h-[55vh] min-h-[350px] w-full bg-black">
                            <Cropper
                                image={cropImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={handleCropComplete}
                                cropShape="rect"
                                showGrid
                                objectFit="contain"
                            />
                        </div>

                        <div className="border-t border-slate-700 px-5 py-4">
                            <div className="mb-2 flex justify-between text-xs text-slate-400">
                                <span>Zoom</span>

                                <span>{zoom.toFixed(1)}x</span>
                            </div>

                            <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.1"
                                value={zoom}
                                onChange={(event) =>
                                    setZoom(Number(event.target.value))
                                }
                                className="w-full"
                            />
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-700 px-5 py-4">
                            <button
                                type="button"
                                onClick={handleCancelCrop}
                                disabled={processingCrop}
                                className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                onClick={handleUseImage}
                                disabled={processingCrop || !croppedAreaPixels}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processingCrop
                                    ? 'Memproses...'
                                    : 'Gunakan Gambar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function BuilderPhoto({ images, setImages }: BuilderPhotoProps) {
    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold tracking-wider text-emerald-400 uppercase">
                <ImageIcon className="h-3.5 w-3.5" />

                <span>Foto</span>
            </div>

            <div className="space-y-6">
                <ImageUploader
                    label="Desktop"
                    value={images.desktop}
                    aspectRatio={16 / 9}
                    onChange={(file) =>
                        setImages({
                            ...images,
                            desktop: file,
                        })
                    }
                />

                <ImageUploader
                    label="Tablet"
                    value={images.tablet}
                    aspectRatio={4 / 3}
                    onChange={(file) =>
                        setImages({
                            ...images,
                            tablet: file,
                        })
                    }
                />

                <ImageUploader
                    label="HP"
                    value={images.mobile}
                    aspectRatio={3 / 4}
                    onChange={(file) =>
                        setImages({
                            ...images,
                            mobile: file,
                        })
                    }
                />
            </div>
        </div>
    );
}
