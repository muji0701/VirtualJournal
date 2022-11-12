package com.example.lab_3;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.widget.TextView;
import android.location.LocationManager;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.example.lab_3.databinding.ActivityMainBinding;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class MainActivity extends Activity {

    private TextView HRView;
    private TextView locationView;
    private Date lastTime;
    private static final int BODY_PERMISSION_CODE = 100;
    private static final int WRITE_PERMISSION_CODE = 200;
    private ActivityMainBinding binding;
    LocationManager lm;
    private String provider;
    private Map<Date, String> record = new HashMap<>();
    double currentLon = 0;
    double currentLat = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        System.out.println(12345);

        SensorManager mSensorManager = ((SensorManager)getSystemService(SENSOR_SERVICE));
        lm = (LocationManager) getSystemService(LOCATION_SERVICE);
        List<String> providerList = lm.getProviders(true);
        if (providerList.contains(LocationManager.GPS_PROVIDER)) {
            provider = LocationManager.GPS_PROVIDER;
        } else if (providerList.contains(LocationManager.NETWORK_PROVIDER)) {
            provider = LocationManager.NETWORK_PROVIDER;
        } else {
            // 当没有可用的位置提供器时，弹出Toast提示用户
            Toast.makeText(this, "No location provider to use", Toast.LENGTH_SHORT).show();
            return;
        }
        List<Sensor> sensors = mSensorManager.getSensorList(Sensor.TYPE_ALL);
        ArrayList<String> arrayList = new ArrayList<String>();
        for (Sensor sensor : sensors) {
            arrayList.add(sensor.getName());
        }
        Sensor mHeartRateSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE);
        checkPermission(Manifest.permission.BODY_SENSORS, BODY_PERMISSION_CODE);
        System.out.println(mHeartRateSensor);
        HRView = findViewById(R.id.HR);
        locationView = findViewById(R.id.location);
        if(HRView == null) {
            System.out.println("mTextView");
        }
        HRView.setText("hello");
        mSensorManager.registerListener(new SensorEventListener() {
            @Override
            public void onSensorChanged(SensorEvent event) {
                System.out.println("onSensorChanged");
                if (event.sensor.getType() == Sensor.TYPE_HEART_RATE) {
                    String msg = "" + (int)event.values[0];
                    HRView.setText(msg);
                    Date currentTime = Calendar.getInstance().getTime();
                    if(lastTime == null || currentTime.getTime() - lastTime.getTime() > 10000) {
                        System.out.println("date");
                        System.out.println(currentTime);
                        lastTime = currentTime;
                        record.put(currentTime, msg);
                        System.out.println(record);
                    }


                }
                else
                    System.out.println("Unknown sensor type");
            }

            @Override
            public void onAccuracyChanged(Sensor sensor, int accuracy) {

            }
        },mHeartRateSensor, SensorManager.SENSOR_DELAY_NORMAL);

    }

    public void onStop() {

        super.onStop();
        System.out.println("onstop");
        checkPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, WRITE_PERMISSION_CODE);
        saveRecordFileIntoDevice("record");
        readFile();
    }
    // Function to check and request permission.
    public void checkPermission(String permission, int requestCode)
    {
        if (ContextCompat.checkSelfPermission(MainActivity.this, permission) == PackageManager.PERMISSION_DENIED) {

            // Requesting the permission
            ActivityCompat.requestPermissions(MainActivity.this, new String[] { permission }, requestCode);
        }
        else {
            Toast.makeText(MainActivity.this, "Permission already granted", Toast.LENGTH_SHORT).show();
        }
    }

    // This function is called when the user accepts or decline the permission.
    // Request Code is used to check which permission called this function.
    // This request code is provided when the user is prompt for permission.

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                            String[] permissions,
                                            int[] grantResults) {
        super.onRequestPermissionsResult(requestCode,
                permissions,
                grantResults);

        if (requestCode == BODY_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(MainActivity.this, "Body Permission Granted", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(MainActivity.this, "Body Permission Denied", Toast.LENGTH_SHORT).show();
            }
        }else if(requestCode == WRITE_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(MainActivity.this, "Write Permission Granted", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(MainActivity.this, "Write Permission Denied", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void saveRecordFileIntoDevice(String fileName) {
        if (!isExternalStorageWritable()) System.out.println("External storage is not writable"); //This line does not show anything on the log. So, esExternalStorageWritable returns false.
        File rootDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS);//Environment.getExternalStorageDirectory();
        if (!rootDir.canWrite())
        {
            System.out.println("cannot write in the root: "+rootDir.toString()+", space: "+rootDir.getUsableSpace()+", can read: "+rootDir.canRead()+", list: "+rootDir.list());
        }
        String content = record.toString();
        File f = getOutputFile(fileName);

        try {
            FileWriter fw = new FileWriter(f.getAbsoluteFile());
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(content);
            bw.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private File getOutputFile(String fileName){
        File fileStorageDir = new File(this.getExternalFilesDir(null)
                + "/Android/data/"
                + getApplicationContext().getPackageName()
                + "/Files");

        // Create the storage directory if it does not exist
        if (! fileStorageDir.exists()){
            if (! fileStorageDir.mkdirs()){
                return null;
            }
        }

        File f;
        String mFileName= fileName + ".txt";
        System.out.println("filepath");
        System.out.println(fileStorageDir.getPath() + File.separator + mFileName);
        f = new File(fileStorageDir.getPath() + File.separator + mFileName);
        return f;
    }
    /* Checks if external storage is available for read and write */
    private boolean isExternalStorageWritable()
    {
        String state = Environment.getExternalStorageState();
        if (Environment.MEDIA_MOUNTED.equals(state))
        {
            return true;
        }
        return false;
    }

    private void readFile() {
        File file = new File("/storage/emulated/0/Android/data/com.example.lab_3/files/Android/data/com.example.lab_3/Files/record.txt");
        try {
            Scanner sc = new Scanner(file);
            while (sc.hasNextLine()) {
                System.out.println("nextline");
                System.out.println(sc.nextLine());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}