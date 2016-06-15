(ns bob-poc.routes.band-routes
  (:require [compojure.core :refer [defroutes context GET POST]]
            [clojure.tools.logging :refer [debug]]
            [bob-poc.match.match-service :as match]
            [ring.util.http-response :refer [ok]]
            [bob-poc.match.match-handler :refer [match-ws-handler]]
            [compojure.route :refer [resources]]
            [bob-poc.application.data :as data]))

(defroutes band-routes
   (resources "/")
   (context "/v1" []
     (GET "/current-contendees" []
       (debug "Requesting how many contendees...")
       (ok (match/get-current-match)))

     (POST "/song" {{band-name :name band-image :img stream-url :url} :body}
       (debug "TEst")
       (ok (data/add-new-song! band-name band-image stream-url)))))