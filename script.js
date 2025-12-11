// Menunggu sampai seluruh isi halaman selesai dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('nilaiCalculatorForm');
            const resultOutput = document.getElementById('resultOutput');
            
            // Definisi ambang batas nilai (thresholdsByKelompok tetap sama)
            const thresholdsByKelompok = {
                'Mudah': {
                    'A': { min: 80, max: 100, mutu: 4.0, predikat: 'Sangat Baik' },
                    'A-': { min: 75, max: 79, mutu: 3.5, predikat: 'Sangat Baik' },
                    'B': { min: 70, max: 74, mutu: 3.0, predikat: 'Baik' },
                    'B-': { min: 65, max: 69, mutu: 2.5, predikat: 'Baik' },
                    'C': { min: 55, max: 64, mutu: 2.0, predikat: 'Cukup' },
                    'C-': { min: 50, max: 54, mutu: 1.5, predikat: 'Cukup' },
                    'D': { min: 40, max: 49, mutu: 1.0, predikat: 'Kurang' },
                    'E': { min: 0, max: 39, mutu: 0.0, predikat: 'Tidak Lulus' }
                },
                'Sedang': {
                    'A': { min: 75, max: 100, mutu: 4.0, predikat: 'Sangat Baik' },
                    'A-': { min: 70, max: 74, mutu: 3.5, predikat: 'Sangat Baik' },
                    'B': { min: 65, max: 69, mutu: 3.0, predikat: 'Baik' },
                    'B-': { min: 55, max: 64, mutu: 2.5, predikat: 'Baik' },
                    'C': { min: 50, max: 54, mutu: 2.0, predikat: 'Cukup' },
                    'C-': { min: 45, max: 49, mutu: 1.5, predikat: 'Cukup' },
                    'D': { min: 35, max: 44, mutu: 1.0, predikat: 'Kurang' },
                    'E': { min: 0, max: 34, mutu: 0.0, predikat: 'Tidak Lulus' }
                },
                'Sulit': {
                    'A': { min: 70, max: 100, mutu: 4.0, predikat: 'Sangat Baik' },
                    'A-': { min: 65, max: 69, mutu: 3.5, predikat: 'Sangat Baik' },
                    'B': { min: 60, max: 64, mutu: 3.0, predikat: 'Baik' },
                    'B-': { min: 55, max: 59, mutu: 2.5, predikat: 'Baik' },
                    'C': { min: 45, max: 54, mutu: 2.0, predikat: 'Cukup' },
                    'C-': { min: 40, max: 44, mutu: 1.5, predikat: 'Cukup' },
                    'D': { min: 30, max: 39, mutu: 1.0, predikat: 'Kurang' },
                    'E': { min: 0, max: 29, mutu: 0.0, predikat: 'Tidak Lulus' }
                }
            };

            function getGradeDetails(score, kelompokThresholds) {
                let huruf = '';
                
                if (score >= kelompokThresholds['A'].min) {
                    huruf = 'A';
                } else if (score >= kelompokThresholds['A-'].min) {
                    huruf = 'A-';
                } else if (score >= kelompokThresholds['B'].min) {
                    huruf = 'B';
                } else if (score >= kelompokThresholds['B-'].min) {
                    huruf = 'B-';
                } else if (score >= kelompokThresholds['C'].min) {
                    huruf = 'C';
                } else if (score >= kelompokThresholds['C-'].min) {
                    huruf = 'C-';
                } else if (score >= kelompokThresholds['D'].min) {
                    huruf = 'D';
                } else {
                    huruf = 'E';
                }

                const details = kelompokThresholds[huruf];
                const mutu = details.mutu;
                const predikat = details.predikat;

                return { huruf, mutu, predikat };
            }

            // --- FUNGSI MENGONTROL INPUT BERPRAKTIK (TOGGLE INPUTS) ---
            const jenisPembelajaranSelect = document.getElementById('jenis_pembelajaran');
            const skorKomponenContainer = document.getElementById('skor_komponen_container');
            const skorKomponenInput = document.getElementById('skor_komponen');
            const skorKomponenLabel = document.getElementById('skor_komponen_label');
            const tugasBerpraktikContainer = document.getElementById('tugas_berpraktik_container');
            const tugas1Input = document.getElementById('tugas1');
            const tugas2Input = document.getElementById('tugas2');
            const tugas3Input = document.getElementById('tugas3');

            function toggleInputs() {
                const jenis = jenisPembelajaranSelect.value;
                if (jenis === 'Berpraktik') {
                    // Sembunyikan input umum
                    skorKomponenContainer.style.display = 'none';
                    skorKomponenInput.removeAttribute('required');
                    skorKomponenInput.value = '';

                    // Tampilkan 3 input tugas
                    tugasBerpraktikContainer.style.display = 'block';
                    // (Hapus semua .setAttribute('required', 'required') dari sini)
                    
                } else {
                    // Tampilkan input umum
                    skorKomponenContainer.style.display = 'block';
                    skorKomponenInput.setAttribute('required', 'required');

                    // Update label sesuai jenis pembelajaran
                    if (jenis === 'TTM' || jenis === 'Tutorial Online') {
                        skorKomponenLabel.textContent = `Skor ${jenis} (0-100):`;
                    } else {
                        skorKomponenLabel.textContent = `Skor Tutorial Tatap Muka / Tutorial Online / Tugas Berpraktik (0-100):`;
                    }
                    
                    // Sembunyikan 3 input tugas
                    tugasBerpraktikContainer.style.display = 'none';
                    // (Hapus semua .removeAttribute('required') dari sini)
                    tugas1Input.value = '';
                    tugas2Input.value = '';
                    tugas3Input.value = '';
                }
            }

            // Panggil fungsi saat terjadi perubahan dan saat halaman dimuat
            jenisPembelajaranSelect.addEventListener('change', toggleInputs);
            toggleInputs(); 
            // --- AKHIR FUNGSI TOGGLE INPUTS ---


            form.addEventListener('submit', function(event) {
                event.preventDefault();

                resultOutput.innerHTML = '';
                const existingError = document.querySelector('.error');
                if (existingError) {
                    existingError.remove();
                }

                const nama_mk = document.getElementById('nama_mk').value;
                const jenis_pembelajaran = document.getElementById('jenis_pembelajaran').value;
                // Pastikan input UAS valid
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
              
  
                if (jumlah_soal <= 0) {
                    errorMessage = 'Jumlah Soal UAS harus lebih dari 0.';
                } else if (jumlah_benar < 0 || jumlah_benar > jumlah_soal) {
                    errorMessage = 'Jumlah Jawaban Benar UAS tidak valid (0-Jumlah Soal).';
                } else if (jenis_pembelajaran !== 'Berpraktik' && (skor_komponen_umum < 0 || skor_komponen_umum > 100)) {
                    errorMessage = 'Skor TTM/TO harus antara 0 dan 100.';
                } else if (jenis_pembelajaran === "") {
                    errorMessage = 'Pilih jenis pembelajaran yang valid.';
                }
                        
                if (errorMessage) {
                    const errorMessageDiv = document.createElement('p');
                    errorMessageDiv.className = 'error mt-3 text-center';
                    errorMessageDiv.textContent = errorMessage;
                    resultOutput.appendChild(errorMessageDiv);
                    return;
                }

                // --- LOGIKA CEK SYARAT MUTLAK BERPRAKTIK 
                if (jenis_pembelajaran === 'Berpraktik') {
                    // Ambil nilai string mentah untuk membedakan antara kosong dan nilai 0
                    const t1_raw = document.getElementById('tugas1').value;
                    const t2_raw = document.getElementById('tugas2').value;
                    const t3_raw = document.getElementById('tugas3').value;
    
                    // 1. Cek Syarat Mutlak (Tidak boleh ada input kosong/tidak diisi)
                    if (t1_raw === '' || t2_raw === '' || t3_raw === '') {
                        tugas_berpraktik_error = true; // Otomatis E jika ada yang kosong (tidak dikerjakan)
                    } else {
                       
                        const t1 = parseFloat(t1_raw);
                        const t2 = parseFloat(t2_raw);
                        const t3 = parseFloat(t3_raw);
                        
                        if (isNaN(t1) || isNaN(t2) || isNaN(t3) || t1 < 0 || t1 > 100 || t2 < 0 || t2 > 100 || t3 < 0 || t3 > 100) {
                            errorMessage = 'Skor Tugas Praktik harus antara 0 dan 100.';
                        } else {
                            tugas_berpraktik_error = false; // Pastikan false
                            skor_praktik_rata2 = (t1 + t2 + t3) / 3;
                        }
                    }
                }
                // 

                if (errorMessage) {
                    const errorMessageDiv = document.createElement('p');
                    errorMessageDiv.className = 'error mt-3 text-center';
                    errorMessageDiv.textContent = errorMessage;
                    resultOutput.appendChild(errorMessageDiv);
                    return;
                }

                skor_uas = (jumlah_benar / jumlah_soal) * 100;
                
                let rumus_perhitungan = '';
                let keterangan_rumus = '';
                // Variabel t1_val, t2_val, t3_val tidak lagi digunakan di sini
              
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
                            keterangan_rumus = 'Nilai akhir otomatis dianggap E karena skor UAS di bawah 30, terlepas berapapun skor Tutorial Online.';
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
                            keterangan_rumus = `Nilai akhir otomatis E karena salah satu tugas berpraktik tidak diisi/dikerjakan.`; // Pesan disesuaikan
                        } else {
                            nilai_akhir = (0.5 * skor_praktik_rata2) + (0.5 * skor_uas);
                            rumus_perhitungan = 'Nilai Akhir = (0.5 * Rata-rata Skor Praktik Online) + (0.5 * Skor UAS)';
                            keterangan_rumus = `Pembobotan 50% untuk rata-rata nilai praktik (T1, T2, T3) dan 50% untuk UAS. `;
                        }
                        break;
                    default:
                        errorMessage = 'Jenis pembelajaran tidak dikenal.';
                        break;
                }

                if (errorMessage) {
                    const errorMessageDiv = document.createElement('p');
                    errorMessageDiv.className = 'error mt-3 text-center';
                    errorMessageDiv.textContent = errorMessage;
                    resultOutput.appendChild(errorMessageDiv);
                    return;
                }
                        
// --- LOGIKA KONVERSI DAN TAMPILAN HASIL ---
                const resultMudah = getGradeDetails(nilai_akhir, thresholdsByKelompok['Mudah']);
                const resultSedang = getGradeDetails(nilai_akhir, thresholdsByKelompok['Sedang']);
                const resultSulit = getGradeDetails(nilai_akhir, thresholdsByKelompok['Sulit']);

                let finalResultHtml = '';
                
                if (jenis_pembelajaran === 'Berpraktik') {
                    finalResultHtml = `
                        <div class="alert alert-info text-center mt-3" role="alert">
                            <i class="fas fa-info-circle"></i> 
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-4 mb-3">
                                <div class="card h-100 text-bg-danger border-primary">
                                    <div class="card-header fw-bold bg-primary text-white">Kelompok Matkul: Sulit</div>
                                    <div class="card-body">
                                        <h5 class="card-title">Huruf: ${resultSulit.huruf}</h5>
                                        <p class="card-text mb-0">Mutu: ${resultSulit.mutu.toFixed(1)}</p>
                                        <p class="card-text mb-0">Predikat: ${resultSulit.predikat}</p>
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
                                <div class="card h-100 text-bg-success">
                                    <div class="card-header fw-bold">Kelompok Matkul: Mudah</div>
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
                        <p class="mb-2 text-secondary">Hasil Perhitungan untuk MK: <strong class="text-success" id="nama_mk_output"></strong></p>
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
                        
                        <div class="d-grid gap-2 d-sm-block mt-3">
                            <button type="button" id="printButton" class="btn btn-primary-custom w-100 mb-2 mb-sm-0">
                                Cetak Hasil
                            </button>
                            <button type="button" id="resetButton" class="btn btn-reset-custom w-100">
                                Hitung Ulang
                            </button>
                        </div>
                    </div>
                `;
                resultOutput.innerHTML = resultHtml;

                // FIX KEAMANAN XSS: Menggunakan textContent untuk menyisipkan nama_mk agar aman dari injeksi HTML/script
                const namaMkOutputElement = document.getElementById('nama_mk_output');
                if (namaMkOutputElement) {
                    namaMkOutputElement.textContent = nama_mk;
                }
                // AKHIR FIX KEAMANAN XSS
                
                document.getElementById('resetButton').addEventListener('click', function() {
                    form.reset();
                    resultOutput.innerHTML = '';
                    toggleInputs();
                });
                
                // --- FUNGSI CETAK ---
                document.getElementById('printButton').addEventListener('click', function() {
                    window.print();
                });
                // -------------------------

            });
        });
