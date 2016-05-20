(ns bob-poc.core
  (:gen-class)
  (:require [clojure.tools.logging :refer [info error]]
            [ring.adapter.jetty :as jetty]
            [bob-poc.routes.handler :refer [app]]
            [bob-poc.match.match-service :as match])
  (:import [java.lang Runtime Thread]))

(def ^:private app-server (atom nil))

(defn- start-server []
  (info "Starting BoB-POC...")
  (reset! app-server (jetty/run-jetty app {:max-threads 100 :port 3399 :join? false}))
  (match/start-match)
  (info "React test started successfully!"))

(defn- stop-server []
  (info "Stopping BoB-POC...")
  (.stop @app-server)
  (info "BoB-POC stopped successfully!"))

(defn -main []
  (try
    (start-server)
    (.addShutdownHook (Runtime/getRuntime) (Thread. stop-server))
    (catch Exception e
      (do (error "Error happened in main" e) (throw e)))))