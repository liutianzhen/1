/**
 * 简易图片压缩工具
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('图片压缩工具已初始化'); // 调试信息
    
    // 获取DOM元素
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const selectFileBtn = document.getElementById('select-file-btn');
    const previewContainer = document.getElementById('preview-container');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    const compressBtn = document.getElementById('compress-btn');
    const resultsContainer = document.getElementById('results');

    console.log('DOM元素获取状态:', {
        dropArea: !!dropArea,
        fileInput: !!fileInput,
        selectFileBtn: !!selectFileBtn,
        previewContainer: !!previewContainer,
        compressBtn: !!compressBtn,
        resultsContainer: !!resultsContainer
    }); // 调试信息
    
    // 存储上传的图片
    let uploadedImages = [];
    // 默认压缩质量
    const defaultQuality = 70;

    // 拖放上传区域事件
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('active');
        console.log('拖拽文件到上传区域'); // 调试信息
    });

    dropArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('active');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('active');
        console.log('文件已放入上传区域', e.dataTransfer.files.length); // 调试信息
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // 点击整个上传区域触发文件选择
    dropArea.addEventListener('click', function(e) {
        // 如果点击的是选择图片按钮或者预览项，不触发
        if (e.target.id === 'select-file-btn' || 
            e.target.classList.contains('preview-remove') ||
            e.target.closest('.preview-item')) {
            return;
        }
        
        console.log('点击上传区域'); // 调试信息
        if (fileInput) {
            fileInput.click();
        }
    });

    // 点击选择图片按钮
    if (selectFileBtn) {
        selectFileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('点击选择图片按钮'); // 调试信息
            if (fileInput) {
                fileInput.click();
            }
        });
    }

    // 文件选择变化
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            console.log('文件输入变化', e.target.files ? e.target.files.length : 0); // 调试信息
            if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
                // 重置文件输入元素的值，这样用户可以重复选择同一文件
                fileInput.value = '';
            }
        });
    }

    // 压缩质量滑块变化
    if (qualitySlider) { // 添加null检查
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = `${qualitySlider.value}%`;
        });
    }

    // 压缩按钮点击
    compressBtn.addEventListener('click', () => {
        console.log('压缩按钮被点击'); // 调试信息
        compressImages();
    });

    /**
     * 处理上传的文件
     */
    function handleFiles(files) {
        console.log('处理文件', files.length); // 调试信息
        
        // 修改文件类型检测逻辑，更宽松的匹配
        const imageFiles = Array.from(files).filter(file => {
            const isImage = file.type.startsWith('image/');
            console.log('文件类型检查:', file.name, file.type, isImage); // 调试信息
            return isImage;
        });

        if (imageFiles.length === 0) {
            alert('请上传图片格式的文件(JPG、PNG、WebP等)。');
            return;
        }
        
        // 添加图片到上传列表
        imageFiles.forEach(file => {
            if (!uploadedImages.some(img => img.name === file.name && img.size === file.size)) {
                uploadedImages.push(file);
                // 为每个文件创建预览
                createPreview(file);
            }
        });
    }
    
    /**
     * 为上传的图片创建预览
     */
    function createPreview(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (e) => {
            console.log('文件读取完成'); // 调试信息
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = () => {
                console.log('图片加载完成，尺寸:', img.width, 'x', img.height); // 调试信息
                
                // 创建预览元素
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.dataset.filename = file.name; // 存储文件名用于之后识别
                
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <div class="preview-info">
                        <div class="preview-name">${file.name}</div>
                        <div class="preview-size">${formatFileSize(file.size)}</div>
                    </div>
                    <button class="preview-remove" title="移除">&times;</button>
                `;
                
                // 添加删除功能
                const removeBtn = previewItem.querySelector('.preview-remove');
                removeBtn.addEventListener('click', () => {
                    uploadedImages = uploadedImages.filter(img => img.name !== file.name);
                    previewContainer.removeChild(previewItem);
                    console.log('移除图片:', file.name); // 调试信息
                });
                
                // 添加到预览容器
                previewContainer.appendChild(previewItem);
                console.log('预览显示完成'); // 调试信息
                
                // 确保选择图片按钮的可见性，以便用户继续上传更多图片
                ensureSelectButtonVisible();
            };
            
            img.onerror = (error) => {
                console.error('图片加载失败', error); // 调试错误信息
            };
        };
        
        reader.onerror = (error) => {
            console.error('文件读取失败', error); // 调试错误信息
        };
    }

    /**
     * 确保选择图片按钮可见，可用于继续上传图片
     */
    function ensureSelectButtonVisible() {
        // 检查是否存在选择图片按钮，如果不存在，则添加一个
        let selectBtn = document.getElementById('select-file-btn');
        if (!selectBtn) {
            selectBtn = document.createElement('button');
            selectBtn.id = 'select-file-btn';
            selectBtn.className = 'select-file-btn';
            selectBtn.textContent = '继续添加图片';
            selectBtn.type = 'button';
            
            // 重新添加事件监听器
            selectBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('点击选择图片按钮'); // 调试信息
                if (fileInput) {
                    fileInput.click();
                }
            });
            
            // 将按钮添加到dropArea或预览容器前
            if (previewContainer.firstChild) {
                dropArea.insertBefore(selectBtn, previewContainer);
            } else {
                // 如果预览容器为空，则添加到容器中
                dropArea.appendChild(selectBtn);
            }
        }
    }

    /**
     * 压缩所有图片
     */
    async function compressImages() {
        if (uploadedImages.length === 0) {
            alert('请先上传图片！');
            return;
        }

        console.log('开始压缩图片，共', uploadedImages.length, '张'); // 调试信息

        // 清空结果区域
        resultsContainer.innerHTML = '';
        
        // 获取压缩质量（即使控件被隐藏也能正常工作）
        const quality = qualitySlider ? qualitySlider.value / 100 : defaultQuality / 100;
        console.log('使用压缩质量:', quality); // 调试信息
        
        // 显示正在处理的提示
        const processingElement = document.createElement('div');
        processingElement.style.textAlign = 'center';
        processingElement.style.padding = '20px';
        processingElement.style.gridColumn = '1 / -1';
        processingElement.innerHTML = `
            <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: #3498db; margin-bottom: 10px;"></i>
            <p>正在压缩图片，请稍候...</p>
        `;
        resultsContainer.appendChild(processingElement);
        
        // 压缩每张图片
        const promises = uploadedImages.map(file => {
            console.log('处理图片:', file.name); // 调试信息
            return compressImage(file, quality)
                .then(result => {
                    console.log('压缩成功:', file.name, 
                          '原始大小:', formatFileSize(result.originalSize),
                          '压缩后:', formatFileSize(result.compressedSize),
                          '压缩率:', result.ratio + '%'); // 调试信息
                    return result;
                })
                .catch(error => {
                    console.error(`压缩图片 ${file.name} 失败:`, error);
                    alert(`压缩图片 ${file.name} 失败: ${error.message || '未知错误'}`);
                    return null;
                });
        });
        
        // 等待所有图片压缩完成
        Promise.all(promises).then(results => {
            // 移除处理中提示
            resultsContainer.innerHTML = '';
            
            // 添加所有结果
            results.filter(result => result !== null).forEach(result => {
                addCompressedResult(result);
            });
            
            // 显示完成消息
            if (results.filter(result => result !== null).length > 0) {
                const completedMessage = document.createElement('div');
                completedMessage.style.gridColumn = '1 / -1';
                completedMessage.style.textAlign = 'center';
                completedMessage.style.padding = '10px';
                completedMessage.style.color = '#2ecc71';
                completedMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i> 图片压缩完成！
                `;
                resultsContainer.appendChild(completedMessage);
            }
        });
    }

    /**
     * 压缩单个图片
     */
    function compressImage(file, quality) {
        return new Promise((resolve, reject) => {
            try {
                console.log('开始压缩图片:', file.name); // 调试信息
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = (event) => {
                    try {
                        console.log('文件读取成功，创建图像对象'); // 调试信息
                        const img = new Image();
                        img.src = event.target.result;

                        img.onload = () => {
                            try {
                                console.log('图像加载成功，尺寸:', img.width, 'x', img.height); // 调试信息
                                // 创建canvas
                                const canvas = document.createElement('canvas');
                                let width = img.width;
                                let height = img.height;

                                // 设置最大宽度为1000像素
                                if (width > 1000) {
                                    height = Math.round(1000 * height / width);
                                    width = 1000;
                                }

                                console.log('调整后的尺寸:', width, 'x', height); // 调试信息

                                // 设置canvas尺寸
                                canvas.width = width;
                                canvas.height = height;

                                // 绘制图像
                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0, width, height);

                                console.log('图像绘制到canvas，准备导出为blob'); // 调试信息

                                // 获取压缩后的图像数据
                                canvas.toBlob((blob) => {
                                    if (!blob) {
                                        const error = new Error('图片压缩失败: 无法创建Blob对象');
                                        console.error(error); // 调试信息
                                        reject(error);
                                        return;
                                    }

                                    console.log('blob创建成功，大小:', blob.size, '字节'); // 调试信息

                                    // 计算压缩率
                                    const originalSize = file.size;
                                    const compressedSize = blob.size;
                                    const ratio = Math.round((1 - compressedSize / originalSize) * 100);

                                    // 创建结果对象
                                    const result = {
                                        blob: blob,
                                        url: URL.createObjectURL(blob),
                                        originalFile: file,
                                        originalSize,
                                        compressedSize,
                                        ratio,
                                        name: file.name
                                    };

                                    resolve(result);
                                }, file.type || 'image/jpeg', quality); // 尝试保留原始图像类型
                            } catch (error) {
                                console.error('Canvas处理过程中发生错误:', error); // 调试信息
                                reject(new Error('图像处理失败: ' + (error.message || '未知错误')));
                            }
                        };

                        img.onerror = (error) => {
                            console.error('图像加载失败:', error); // 调试信息
                            reject(new Error('加载图片失败: ' + (error.message || '未知错误')));
                        };
                    } catch (error) {
                        console.error('读取文件后的处理过程中发生错误:', error); // 调试信息
                        reject(new Error('处理文件数据失败: ' + (error.message || '未知错误')));
                    }
                };

                reader.onerror = (error) => {
                    console.error('读取文件失败:', error); // 调试信息
                    reject(new Error('读取文件失败: ' + (error.message || '未知错误')));
                };
            } catch (error) {
                console.error('压缩过程中发生错误:', error); // 调试信息
                reject(new Error('压缩过程中发生错误: ' + (error.message || '未知错误')));
            }
        });
    }

    /**
     * 添加压缩结果到结果区域
     */
    function addCompressedResult(result) {
        try {
            console.log('添加压缩结果到界面'); // 调试信息
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            resultItem.innerHTML = `
                <img src="${result.url}" alt="${result.name}">
                <div class="result-info">
                    <div class="name">${result.name}</div>
                    <div class="size">原始: ${formatFileSize(result.originalSize)} → 压缩后: ${formatFileSize(result.compressedSize)}</div>
                    <div class="ratio">压缩率: ${result.ratio}%</div>
                </div>
                <div class="result-actions">
                    <button class="download-btn">下载</button>
                </div>
                <button class="result-remove" title="移除">&times;</button>
            `;
            
            // 添加下载事件
            const downloadBtn = resultItem.querySelector('.download-btn');
            downloadBtn.addEventListener('click', () => {
                console.log('点击下载按钮'); // 调试信息
                downloadImage(result.blob, getCompressedFileName(result.name));
            });
            
            // 添加删除事件
            const deleteBtn = resultItem.querySelector('.result-remove');
            deleteBtn.addEventListener('click', () => {
                console.log('删除压缩结果:', result.name); // 调试信息
                resultItem.remove();
                // 释放Blob URL，防止内存泄漏
                URL.revokeObjectURL(result.url);
            });
            
            resultsContainer.appendChild(resultItem);
            console.log('结果添加完成'); // 调试信息
        } catch (error) {
            console.error('添加结果到界面时发生错误:', error); // 调试信息
            alert('显示压缩结果失败: ' + (error.message || '未知错误'));
        }
    }

    /**
     * 下载图片
     */
    function downloadImage(blob, fileName) {
        try {
            console.log('准备下载图片:', fileName); // 调试信息
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link); // 确保在所有浏览器中工作
            link.click();
            document.body.removeChild(link); // 清理
            
            setTimeout(() => {
                URL.revokeObjectURL(url);
                console.log('下载完成，已释放对象URL'); // 调试信息
            }, 100);
        } catch (error) {
            console.error('下载图片时发生错误:', error); // 调试信息
            alert('下载图片失败: ' + (error.message || '未知错误'));
        }
    }

    /**
     * 获取压缩后的文件名
     */
    function getCompressedFileName(originalName) {
        const baseName = originalName.replace(/\.[^/.]+$/, '');
        return `${baseName}-compressed.jpg`;
    }

    /**
     * 格式化文件大小
     */
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
    }

    // 重置上传功能
    function resetUploadArea() {
        previewContainer.innerHTML = '';
        uploadedImages = [];
        
        // 重建上传区域的默认显示
        // 检查选择图片按钮是否存在，如果不存在则添加
        if (!document.getElementById('select-file-btn')) {
            const selectBtn = document.createElement('button');
            selectBtn.id = 'select-file-btn';
            selectBtn.className = 'select-file-btn';
            selectBtn.textContent = '选择图片';
            selectBtn.type = 'button';
            
            // 重新添加事件监听器
            selectBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('点击选择图片按钮'); // 调试信息
                if (fileInput) {
                    fileInput.click();
                }
            });
            
            // 在预览容器前添加按钮
            dropArea.insertBefore(selectBtn, previewContainer);
        }
    }

    // 添加重置按钮
    const resetBtn = document.createElement('button');
    resetBtn.id = 'reset-btn';
    resetBtn.textContent = '重新上传';
    resetBtn.style.marginLeft = '10px';
    resetBtn.style.backgroundColor = '#e74c3c';
    resetBtn.style.color = 'white';
    resetBtn.style.border = 'none';
    resetBtn.style.padding = '12px 20px';
    resetBtn.style.borderRadius = '5px';
    resetBtn.style.cursor = 'pointer';
    
    resetBtn.addEventListener('click', () => {
        console.log('点击重置按钮'); // 调试信息
        resetUploadArea();
        // 清空结果区域
        resultsContainer.innerHTML = '';
    });
    
    compressBtn.parentNode.appendChild(resetBtn);
}); 