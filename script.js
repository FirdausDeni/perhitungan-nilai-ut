// Menunggu sampai seluruh isi halaman selesai dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('nilaiCalculatorForm');
            const resultOutput = document.getElementById('resultOutput');
            
// Definisi ambang batas nilai berdasarkan kelompok mata kuliah.
// Setiap kelompok (Mudah, Sedang, dan Sulit) masing-masing memiliki kriteria nilai huruf (A, A-, B, dst.)
// beserta nilai minimum, maksimum, bobot mutu, dan predikat yang sesuai.
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

// Fungsi untuk menentukan huruf nilai, mutu, dan predikat berdasarkan nilai akhir dan kategori mata kuliah
            function getGradeDetails(score, kelompokThresholds) {
                let huruf = '';
                let mutu = 0;
                let predikat = '';

 // Menentukan nilai huruf berdasarkan skor yang diberikan dan ambang batas kelompok
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

// Setelah nilai huruf (misal A, B, C) ditemukan,
// kode ini mencari detail lengkap dari nilai huruf itu
// (seperti bobot mutu dan predikat Sangat Baik/Cukup/dsb.)
// dari daftar aturan nilai yang sudah ditentukan.
                const details = kelompokThresholds[huruf];
                mutu = details.mutu;
                predikat = details.predikat;

                return { huruf, mutu, predikat };
            }

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
                const skor_komponen = parseInt(document.getElementById('skor_komponen').value);

                let nilai_akhir = 0;
                let errorMessage = '';
                let skor_uas = 0;

// Validasi input
                if (jumlah_soal <= 0) {
                    errorMessage = 'Jumlah Soal UAS harus lebih dari 0.';
                } else if (jumlah_benar < 0 || jumlah_benar > jumlah_soal) {
                    errorMessage = 'Jumlah Jawaban Benar UAS tidak valid (0-Jumlah Soal).';
                } else if (skor_komponen < 0 || skor_komponen > 100) {
                    errorMessage = 'Skor TTM/TO/Praktik harus antara 0 dan 100.';
                } else if (jenis_pembelajaran === "") {
                    errorMessage = 'Pilih jenis pembelajaran yang valid.';
                }
                        
  // Jika ada error validasi, tampilkan pesan error dan hentikan eksekusi
                if (errorMessage) {
                    const errorMessageDiv = document.createElement('p');
                    errorMessageDiv.className = 'error mt-3 text-center';
                    errorMessageDiv.textContent = errorMessage;
                    resultOutput.appendChild(errorMessageDiv);
                    return;
                }

// Menghitung skor UAS dalam skala 0-100
                skor_uas = (jumlah_benar / jumlah_soal) * 100;

                let rumus_perhitungan = '';
                let keterangan_rumus = '';
                        
// Logika Perhitungan Nilai Akhir berdasarkan Jenis Pembelajaran
                switch (jenis_pembelajaran) {
                    case 'TTM':
                        if (skor_uas < 30) {
                            nilai_akhir = skor_uas;
                            rumus_perhitungan = 'Nilai Akhir = Skor UAS (Otomatis E)';
                            keterangan_rumus = 'Nilai akhir otomatis dianggap E karena skor UAS di bawah 30, terlepas dari skor TTM.';
                        } else if (skor_komponen < skor_uas) {
                            nilai_akhir = skor_uas;
                            rumus_perhitungan = 'Nilai Akhir = Skor UAS';
                            keterangan_rumus = 'Pembobotan 50% untuk UAS dan 50% untuk komponen TTM berlaku jika nilai UAS minimal 30. Namun, jika skor TTM lebih rendah dari skor UAS, nilai akhir diambil dari skor UAS.';
                        } else {
                            nilai_akhir = (0.5 * skor_uas) + (0.5 * skor_komponen);
                            rumus_perhitungan = 'Nilai Akhir = (0.5 * Skor UAS) + (0.5 * Skor Komponen TTM)';
                            keterangan_rumus = 'Pembobotan 50% untuk UAS dan 50% untuk komponen TTM berlaku jika nilai UAS minimal 30.';
                        }
                        break;
                    case 'Tutorial Online':
                        if (skor_uas < 30) {
                            nilai_akhir = skor_uas;
                            rumus_perhitungan = 'Nilai Akhir = Skor UAS (Otomatis E)';
                            keterangan_rumus = 'Nilai akhir otomatis dianggap E karena skor UAS di bawah 30, terlepas dari skor Tutorial Online.';
                        } else if (skor_komponen < skor_uas) {
                            nilai_akhir = skor_uas;
                            rumus_perhitungan = 'Nilai Akhir = Skor UAS';
                            keterangan_rumus = 'Pembobotan 70% untuk UAS dan 30% untuk komponen Tutorial Online berlaku jika nilai UAS minimal 30. Namun, jika skor Tutorial Online lebih rendah dari skor UAS, nilai akhir diambil dari skor UAS.';
                        } else {
                            nilai_akhir = (0.7 * skor_uas) + (0.3 * skor_komponen);
                            rumus_perhitungan = 'Nilai Akhir = (0.7 * Skor UAS) + (0.3 * Skor Komponen Tutorial Online)';
                            keterangan_rumus = 'Pembobotan 70% untuk UAS dan 30% untuk komponen Tutorial Online berlaku jika nilai UAS minimal 30.';
                        }
                        break;
                    case 'Berpraktik':
                        nilai_akhir = (0.5 * skor_komponen) + (0.5 * skor_uas);
                        rumus_perhitungan = 'Nilai Akhir = (0.5 * Skor Komponen Praktik) + (0.5 * Skor UAS)';
                        keterangan_rumus = 'Pembobotan 50% untuk nilai praktik dan 50% untuk UAS.';
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
                        
// Mendapatkan detail grade untuk setiap kelompok mata kuliah (Mudah, Sedang, Sulit)
                const resultMudah = getGradeDetails(nilai_akhir, thresholdsByKelompok['Mudah']);
                const resultSedang = getGradeDetails(nilai_akhir, thresholdsByKelompok['Sedang']);
                const resultSulit = getGradeDetails(nilai_akhir, thresholdsByKelompok['Sulit']);

                const resultHtml = `
                    <div class="result p-4 text-center">
                        <p class="mb-2 text-secondary">Hasil Perhitungan untuk MK: <strong class="text-success">${nama_mk}</strong></p>
                        <p class="mb-2 text-secondary">Jenis Pembelajaran: <strong class="text-success">${jenis_pembelajaran}</strong></p>
                        
                        <p class="mb-2 text-secondary">Benar UAS: <strong class="text-success">${jumlah_benar}</strong></p>
                        <p class="mb-2 text-secondary">Soal UAS: <strong class="text-success">${jumlah_soal}</strong></p>
                        <p class="mb-2 text-secondary">Skor UAS: <strong class="text-success">${skor_uas.toFixed(2)}</strong></p>
                        <p class="mb-2 text-secondary">Skor TTM/TO/Praktik: <strong class="text-success">${skor_komponen}</strong></p>
                        
                        <hr class="my-3">
                        <h4 class="mb-3 text-primary fs-4">Estimasi Nilai Akhir Anda: <strong class="text-success">${nilai_akhir.toFixed(2)}</strong></h4>
                        
                        <hr class="my-3">
                        <h5 class="mb-3 text-primary fs-4">Bagaimana Nilai Akhir Dihitung:</h5>
                        <p class="text-start mb-1 fs-6"><strong>Rumus yang Digunakan:</strong> ${rumus_perhitungan}</p>
                        <p class="text-start mb-3 fs-6"><strong>Keterangan:</strong> ${keterangan_rumus}</p>

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
                        <button type="button" id="resetButton" class="btn btn-reset-custom w-100">Hitung Ulang</button>
                    </div>
                `;
                resultOutput.innerHTML = resultHtml;
// Reset semua input dan hapus hasil perhitungan saat tombol "Hitung Ulang" diklik
                document.getElementById('resetButton').addEventListener('click', function() {
                    form.reset();
                    resultOutput.innerHTML = '';
                });
            });
        });
