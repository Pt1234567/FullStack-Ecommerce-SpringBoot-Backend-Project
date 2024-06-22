package com.prash.ecommerce.config;

import com.prash.ecommerce.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {


    @Value("${allowed.origins}")
    private  String[] theAllowedOrigins;
    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager=theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] theUnSupportedActions={HttpMethod.POST,HttpMethod.POST,HttpMethod.DELETE,HttpMethod.PATCH};

        //disable http methods for put post and delete
        disableHttpMethods(Product.class,config, theUnSupportedActions);
        disableHttpMethods(ProductCategory.class,config, theUnSupportedActions);
        disableHttpMethods(Country.class,config, theUnSupportedActions);
        disableHttpMethods(State.class,config, theUnSupportedActions);
        disableHttpMethods(Order.class,config,theUnSupportedActions);

        //call an internal helper method
        esposeIds(config);
        cors.addMapping(config.getBasePath()+"/**").allowedOrigins(theAllowedOrigins);
    }

    private static void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] theUnSupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions));
    }

    private void esposeIds(RepositoryRestConfiguration config) {
        //expose entity ids

        //get a list of all entity classes from entity manager
        Set<EntityType<?>> entities=entityManager.getMetamodel().getEntities();

        //create an array of entity types
        List<Class> entityClass=new ArrayList<>();

        //get entity types for entities
        for(EntityType tempEntity:entities){
            entityClass.add(tempEntity.getJavaType());
        }

        //expose the entity ids
        Class[] domainTypes=entityClass.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
