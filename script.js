// FILE: script.js (Versi Final dengan Perbaikan Konversi Nilai)

// ... (Bagian Thresholds dan getGradeDetails tetap sama) ...

            // ... (Kode setup form, toggleInputs, dan event listener tetap sama) ...
            
            form.addEventListener('submit', function(event) {
                event.preventDefault();

                resultOutput.innerHTML = '';
                const existingError = document.querySelector('.error');
                if (existingError) {
                    existingError.remove();
                }

                // Mengambil nilai dari input formulir                        
                const nama_mk = document.getElementById('nama_mk').value;
                const jenis_pembelajaran = document.getElementById('jenis_pembelajaran').value;
                const jumlah_benar = parseInt(document.getElementById('jumlah_benar').value);
                const jumlah_soal = parseInt(document.getElementById('jumlah_soal').value);
                
                let skor_komponen_umum = 0;
                if (jenis_pembelajaran !== 'Berpraktik') {
                    skor_komponen_umum = parseInt(document.getElementById('skor_komponen').value);
                }
                
                let nilai_akhir = 0;
                let errorMessage = '';
                let skor_uas = 0;
                let skor_praktik_rata2 = 0;
                let tugas_berpraktik_error = false;
                
// Validasi input
                if (jumlah_soal <= 0) {
                    errorMessage = 'Jumlah Soal UAS harus lebih dari 0.';
                } else if (jumlah_benar < 0 || jumlah_benar > jumlah_soal) {
                    errorMessage = 'Jumlah Jawaban Benar UAS tidak valid (0-Jumlah Soal).';
                } else if (jenis_pembelajaran !== 'Berpraktik' && (skor_komponen_umum < 0 || skor_komponen_umum > 100)) {
                    errorMessage = 'Skor TTM/TO harus antara 0 dan 100.';
                } else if (jenis_pembelajaran === "") {
                    errorMessage = 'Pilih jenis pembelajaran yang valid.';
                }
                        
  // Jika ada error validasi umum, tampilkan pesan error dan hentikan eksekusi
                if (errorMessage) {
                    const errorMessageDiv = document.createElement('p');
                    errorMessageDiv.className = 'error mt-3 text-center';
                    errorMessageDiv.textContent = errorMessage;
                    resultOutput.appendChild(errorMessageDiv);
                    return;
                }

                // --- LOGIKA CEK SYARAT MUTLAK BERPRAKTIK ---
                if (jenis_pembelajaran === 'Berpraktik') {
                    const t1 = parseFloat(document.getElementById('tugas1').value) || 0;
                    const t2 = parseFloat(document.getElementById('tugas2').value) || 0;
                    const t3 = parseFloat(document.getElementById('tugas3').value) || 0;
                    
                    if (t1 === 0 || t2 === 0 || t3 === 0) {
                        tugas_berpraktik_error = true;
                    } else {
                        skor_praktik_rata2 = (t1 + t2 + t3) / 3;
                    }
                }
                // --- AKHIR LOGIKA CEK SYARAT MUTLAK BERPRAKTIK ---

                skor_uas = (jumlah_benar / jumlah_soal) * 100;
                
                let rumus_perhitungan = '';
                let keterangan_rumus = '';
                let t1_val = tugas_berpraktik_error ? (document.getElementById('tugas1').value || '0') : '';
                let t2_val = tugas_berpraktik_error ? (document.getElementById('tugas2').value || '0') : '';
                let t3_val = tugas_berpraktik_error ? (document.getElementById('tugas3').value || '0') : '';


// Logika Perhitungan Nilai Akhir berdasarkan Jenis Pembelajaran
                switch (jenis_pembelajaran) {
                    case 'TTM':
                        if (skor_uas < 30) {
                            nilai_akhir = skor_uas;
                            rumus_perhitungan = 'Nilai Akhir = Skor UAS (Otomatis E)';
                            keterangan_rumus = 'Nilai akhir otomatis dianggap E karena skor UAS di bawah 30, terlepas dari skor TTM.';
                        } else if (skor_komponen_umum < skor_uas) {
                            nilai_akhir = skor_uas;
                            rumus_perhitungan = 'Nilai Akhir = Skor UAS';
                            keterangan_rumus = 'Pembobotan 50% untuk UAS dan 50% untuk komponen TTM berlaku jika nilai UAS minimal 30. Namun, jika skor TTM lebih rendah dari skor UAS, nilai akhir diambil dari skor UAS.';
                        } else {
                            nilai_akhir = (0.5 * skor_uas) + (0.5 * skor_komponen_umum);
                            rumus_perhitungan = 'Nilai Akhir = (0.5 * Skor UAS) + (0.5 * Skor Komponen TTM)';
                            keterangan_rumus = 'Pembobotan 50% untuk UAS dan 50% untuk komponen TTM berlaku jika nilai UAS minimal 30.';
                        }
                        break;
                    case 'Tutorial Online':
                        if (skor_uas < 30) {
                            nilai_akhir = skor_uas;
                            rumus_perhitungan = 'Nilai Akhir = Skor UAS (Otomatis E)';
                            keterangan_rumus = 'Nilai akhir otomatis dianggap E karena skor UAS di bawah 30, terlepas dari skor Tutorial Online.';
                        } else if (skor_komponen_umum < skor_uas) {
                            nilai_akhir = skor_uas;
                            rumus_perhitungan = 'Nilai Akhir = Skor UAS';
                            keterangan_rumus = 'Pembobotan 70% untuk UAS dan 30% untuk komponen Tutorial Online berlaku jika nilai UAS minimal 30. Namun, jika skor Tutorial Online lebih rendah dari skor UAS, nilai akhir diambil dari skor UAS.';
                        } else {
                            nilai_akhir = (0.7 * skor_uas) + (0.3 * skor_komponen_umum);
                            rumus_perhitungan = 'Nilai Akhir = (0.7 * Skor UAS) + (0.3 * Skor Komponen Tutorial Online)';
                            keterangan_rumus = 'Pembobotan 70% untuk UAS dan 30% untuk komponen Tutorial Online berlaku jika nilai UAS minimal 30.';
                        }
                        break;
                    case 'Berpraktik':
                        if (tugas_berpraktik_error) {
                            nilai_akhir = 0;
                            rumus_perhitungan = 'Nilai Akhir = E (Otomatis)';
                            keterangan_rumus = `Nilai akhir otomatis E karena salah satu (atau lebih) Tugas Praktik (T1: ${t1_val}, T2: ${t2_val}, T3: ${t3_val}) tidak lengkap/kosong, sesuai ralat Kaprodi.`;
                        } else {
                            nilai_akhir = (0.5 * skor_praktik_rata2) + (0.5 * skor_uas);
                            rumus_perhitungan = 'Nilai Akhir = (0.5 * Rata-rata Skor Praktik Online) + (0.5 * Skor UAS)';
                            keterangan_rumus = `Pembobotan 50% untuk rata-rata nilai praktik (T1, T2, T3) dan 50% untuk UAS. **Konversi ke nilai huruf menggunakan ambang batas Kelompok Sulit.**`; // Keterangan tambahan
                        }
                        break;
                    default:
                        errorMessage = 'Jenis pembelajaran tidak dikenal.';
                        break;
                }

 // Jika ada error karena jenis pembelajaran tidak dikenal, tampilkan pesan error
                if (errorMessage) {
                    const errorMessageDiv = document.createElement('p');
                    errorMessageDiv.className = 'error mt-3 text-center';
                    errorMessageDiv.textContent = errorMessage;
                    resultOutput.appendChild(errorMessageDiv);
                    return;
                }
                        
// --- PERBAIKAN LOGIKA KONVERSI NILAI ---
// Jika Berpraktik, hasilkan 3 kartu namun berikan penekanan pada kategori "Sulit"
// Jika TTM/TO, tampilkan 3 kartu untuk estimasi.
                
                const resultMudah = getGradeDetails(nilai_akhir, thresholdsByKelompok['Mudah']);
                const resultSedang = getGradeDetails(nilai_akhir, thresholdsByKelompok['Sedang']);
                const resultSulit = getGradeDetails(nilai_akhir, thresholdsByKelompok['Sulit']);

                let finalResultHtml = '';
                
                if (jenis_pembelajaran === 'Berpraktik') {
                    // Jika MK Berpraktik, tampilkan hasil Sulit di posisi pertama dan beri label peringatan
                    finalResultHtml = `
                        <div class="alert alert-info text-center mt-3" role="alert">
                            <i class="fas fa-info-circle"></i> **PERHATIAN:** Untuk MK Berpraktik, konversi nilai akhir **biasanya** menggunakan ambang batas **Kelompok Sulit**.
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-4 mb-3">
                                <div class="card h-100 text-bg-danger border-primary">
                                    <div class="card-header fw-bold bg-primary text-white">Kelompok Matkul: SULIT (Rekomendasi)</div>
                                    <div class="card-body">
                                        <h5 class="card-title">Huruf: ${resultSulit.huruf}</h5>
                                        <p class="card-text mb-0">Mutu: ${resultSulit.mutu.toFixed(1)}</p>
                                        <p class="card-text mb-0">Predikat: ${resultSulit.predikat}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <div class="card h-100 text-bg-warning">
                                    <div class="card-header fw-bold">Kelompok Matkul: Sedang (Perbandingan)</div>
                                    <div class="card-body">
                                        <h5 class="card-title">Huruf: ${resultSedang.huruf}</h5>
                                        <p class="card-text mb-0">Mutu: ${resultSedang.mutu.toFixed(1)}</p>
                                        <p class="card-text mb-0">Predikat: ${resultSedang.predikat}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <div class="card h-100 text-bg-success">
                                    <div class="card-header fw-bold">Kelompok Matkul: Mudah (Perbandingan)</div>
                                    <div class="card-body">
                                        <h5 class="card-title">Huruf: ${resultMudah.huruf}</h5>
                                        <p class="card-text mb-0">Mutu: ${resultMudah.mutu.toFixed(1)}</p>
                                        <p class="card-text mb-0">Predikat: ${resultMudah.predikat}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    // Jika MK TTM/TO, tampilkan 3 kartu seperti biasa
                    finalResultHtml = `
                        <div class="row justify-content-center">
                            <div class="col-md-4 mb-3">
                                <div class="card h-100 text-bg-success">
                                    <div class="card-header fw-bold">Kelompok Matkul: Mudah</div>
                                    <div class="card-body">
                                        <h5 class="card-title">Huruf: ${resultMudah.huruf}</h5>
                                        <p class="card-text mb-0">Mutu: ${resultMudah.mutu.toFixed(1)}</p>
                                        <p class="card-text mb-0">Predikat: ${resultMudah.predikat}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <div class="card h-100 text-bg-warning">
                                    <div class="card-header fw-bold">Kelompok Matkul: Sedang</div>
                                    <div class="card-body">
                                        <h5 class="card-title">Huruf: ${resultSedang.huruf}</h5>
                                        <p class="card-text mb-0">Mutu: ${resultSedang.mutu.toFixed(1)}</p>
                                        <p class="card-text mb-0">Predikat: ${resultSedang.predikat}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <div class="card h-100 text-bg-danger">
                                    <div class="card-header fw-bold">Kelompok Matkul: Sulit</div>
                                    <div class="card-body">
                                        <h5 class="card-title">Huruf: ${resultSulit.huruf}</h5>
                                        <p class="card-text mb-0">Mutu: ${resultSulit.mutu.toFixed(1)}</p>
                                        <p class="card-text mb-0">Predikat: ${resultSulit.predikat}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
                
                const resultHtml = `
                    <div class="result p-4 text-center">
                        <p class="mb-2 text-secondary">Hasil Perhitungan untuk MK: <strong class="text-success">${nama_mk}</strong></p>
                        <p class="mb-2 text-secondary">Jenis Pembelajaran: <strong class="text-success">${jenis_pembelajaran}</strong></p>
                        
                        <p class="mb-2 text-secondary">Benar UAS: <strong class="text-success">${jumlah_benar}</strong></p>
                        <p class="mb-2 text-secondary">Soal UAS: <strong class="text-success">${jumlah_soal}</strong></p>
                        <p class="mb-2 text-secondary">Skor UAS: <strong class="text-success">${skor_uas.toFixed(2)}</strong></p>
                        
                        ${jenis_pembelajaran !== 'Berpraktik' ? `
                            <p class="mb-2 text-secondary">Skor TTM/TO: <strong class="text-success">${skor_komponen_umum}</strong></p>
                        ` : ''}

                        ${jenis_pembelajaran === 'Berpraktik' ? `
                            <p class="mb-2 text-secondary">Skor Praktik (T1, T2, T3): <strong class="text-success">${document.getElementById('tugas1').value || '0'}, ${document.getElementById('tugas2').value || '0'}, ${document.getElementById('tugas3').value || '0'}</strong></p>
                            ${!tugas_berpraktik_error ? `<p class="mb-2 text-secondary">Rata-rata Praktik (50% Bobot): <strong class="text-success">${skor_praktik_rata2.toFixed(2)}</strong></p>` : ''}
                        ` : ''}
                        
                        <hr class="my-3">
                        <h4 class="mb-3 text-primary fs-4">Estimasi Nilai Akhir Anda: <strong class="text-success">${nilai_akhir.toFixed(2)}</strong></h4>
                        
                        <hr class="my-3">
                        <h5 class="mb-3 text-primary fs-4">Bagaimana Nilai Akhir Dihitung:</h5>
                        <p class="text-start mb-1 fs-6"><strong>Rumus yang Digunakan:</strong> ${rumus_perhitungan}</p>
                        <p class="text-start mb-3 fs-6"><strong>Keterangan:</strong> ${keterangan_rumus}</p>

                        ${finalResultHtml}
                        
                        <button type="button" id="resetButton" class="btn btn-reset-custom w-100">Hitung Ulang</button>
                    </div>
                `;
                resultOutput.innerHTML = resultHtml;

                document.getElementById('resetButton').addEventListener('click', function() {
                    form.reset();
                    resultOutput.innerHTML = '';
                    toggleInputs();
                });
            });
        });
