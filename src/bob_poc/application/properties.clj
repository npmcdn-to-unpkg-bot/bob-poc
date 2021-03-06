(ns bob-poc.application.properties
  (:use [environ.core :only [env]]
        [clojure.tools.logging :only [info]]))

(def server-port (Integer. (or (System/getenv "PORT") "3399")))

(def properties
  {:dev
    {:server-port server-port}

   :dev-test
    {:server-port server-port}

   :test
    {:server-port server-port}

   :production
    {:server-port server-port}})

;Note that Environ automatically lowercases keys, and replaces the characters "_" and "." with "-".
(defn- keyword-to-sysenv-variable [key]
  (clojure.string/replace (name key) #"\." "-"))

(defn current-env []
  (or (env :environment)
      "dev"))

(defn- get-value-from-properties [key]
  (let [env-properties (properties (keyword (current-env)))]
    ((keyword key) env-properties)))

(defn- get-value-from-env-variables [key]
  (let [env-key (keyword-to-sysenv-variable key)]
    (env (keyword env-key))))

(defn- get-env-value[key]
  (or (get-value-from-env-variables key)
      (get-value-from-properties key)))

(defn parse-property [key]
  (let [value (get-env-value key)]
    (if (nil? value)
      (throw (Exception. (str "Value for " key " not given as environment parameter or found from properties file with env " (current-env))))
      value)))

(defn print-properties []
  (let [env-properties (properties (keyword (current-env)))]
    (doseq [[key _] env-properties]
      (info key "=" (parse-property key)))))

(def current-version
  (str (current-env) " - " (:bob-poc-version env)))