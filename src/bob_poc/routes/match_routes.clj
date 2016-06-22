(ns bob-poc.routes.match-routes
  (:require [compojure.core :refer [defroutes context GET POST]]
            [clojure.tools.logging :refer [debug]]
            [bob-poc.match.match-service :as match]
            [ring.util.http-response :refer [ok]]
            [bob-poc.match.match-handler :refer [match-ws-handler]]
            [compojure.route :refer [resources]]))

(defroutes match-routes
  (resources "/")
  (context "/v1" []
    (GET "/match-ws" [] match-ws-handler)

    (GET "/current-match" []
      (debug "Requesting current match...")
      (ok (match/get-current-match)))

    (GET "/disallowed" []
      (debug "Requesting disallowed bands...")
      (ok (match/get-disallowed-bands)))

    (POST "/vote" {{id :id} :body}
      (ok (match/vote! id)))))